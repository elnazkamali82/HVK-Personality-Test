import { DOMAINS, type DomainId, domainById } from "./domains";
import { ITEMS, type Item } from "./instrument";

/** Half a scale point away from the midpoint. A writing rule, not a population norm. */
export const LEAN = 0.5;
export const SCALE_MIN = 1;
export const SCALE_MAX = 5;
export const MIDPOINT = 3;

export type Pole = "high" | "low" | "mid";

export interface DomainScore {
  id: DomainId;
  name: string;
  brief: string;
  mean: number;
  index: number;
  pole: Pole;
}

export interface QualitativeAnswer {
  itemId: string;
  order: number;
  format: Item["format"];
  tag: string;
  label: string;
}

export interface Profile {
  domains: DomainScore[];
  qualitative: QualitativeAnswer[];
}

export class IncompleteAnswers extends Error {
  constructor(message = "Every item needs one answer.") {
    super(message);
    this.name = "IncompleteAnswers";
  }
}

export function keyedScore(raw: number, reverse: boolean): number {
  if (!Number.isInteger(raw) || raw < SCALE_MIN || raw > SCALE_MAX) {
    throw new Error(`Core answers must be integers from ${SCALE_MIN} to ${SCALE_MAX}.`);
  }
  return reverse ? SCALE_MAX + SCALE_MIN - raw : raw;
}

export function toIndex(mean: number): number {
  return Math.round(((mean - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100);
}

export function poleOf(mean: number): Pole {
  if (mean >= MIDPOINT + LEAN) return "high";
  if (mean <= MIDPOINT - LEAN) return "low";
  return "mid";
}

export function scoreProfile(answers: Record<string, number>): Profile {
  const totals = new Map<DomainId, number[]>();
  for (const domain of DOMAINS) {
    totals.set(domain.id, []);
  }

  const qualitative: QualitativeAnswer[] = [];

  for (const item of ITEMS) {
    const raw = answers[item.id];
    if (raw === undefined) {
      throw new IncompleteAnswers();
    }
    const option = item.options.find((entry) => entry.value === raw);
    if (!option) {
      throw new Error(`Answer ${raw} is not an option for ${item.id}.`);
    }
    if (item.scored) {
      if (!item.domain || item.reverse === undefined) {
        throw new Error(`Scored item ${item.id} is missing a key.`);
      }
      totals.get(item.domain)?.push(keyedScore(raw, item.reverse));
      continue;
    }
    if (!option.tag) {
      throw new Error(`Qualitative item ${item.id} is missing a tag.`);
    }
    qualitative.push({
      itemId: item.id,
      order: item.order,
      format: item.format,
      tag: option.tag,
      label: option.label,
    });
  }

  const domains: DomainScore[] = DOMAINS.map((domain) => {
    const values = totals.get(domain.id) ?? [];
    if (values.length !== 6) {
      throw new Error(`${domain.id} should have 6 scored items, found ${values.length}.`);
    }
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    return {
      id: domain.id,
      name: domain.name,
      brief: domain.brief,
      mean,
      index: toIndex(mean),
      pole: poleOf(mean),
    };
  });

  return { domains, qualitative };
}

export function domainScore(profile: Profile, id: DomainId): DomainScore {
  const score = profile.domains.find((domain) => domain.id === id);
  if (!score) {
    throw new Error(`Missing score for ${domainById(id).name}.`);
  }
  return score;
}
