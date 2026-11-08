import { ITEMS } from "./instrument";
import { buildReport, type Report } from "./interpret";
import { scoreProfile } from "./scoring";

/** Fixed answers for a fictional adult, used only to show the report shape. */
const SAMPLE_VALUES = [
  5, 4, 4, 4, 5, 1, 4, 2, 3, 2, 4, 1, 2, 3, 4, 4, 2, 2, 2, 5, 4, 2, 2, 1, 2, 4, 2, 4, 2,
  2, 4, 3, 3, 3, 5, 2,
];

export const sampleAnswers: Record<string, number> = Object.fromEntries(
  ITEMS.map((item, index) => [item.id, SAMPLE_VALUES[index]]),
);

export function sampleReport(): Report {
  return buildReport(scoreProfile(sampleAnswers));
}
