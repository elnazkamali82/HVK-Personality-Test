import { DOMAINS, FACETS, type DomainId, type FacetId } from "../lib/domains";
import { ITEMS } from "../lib/instrument";
import { buildReport } from "../lib/interpret";
import { sampleAnswers, sampleReport } from "../lib/sample";
import { IncompleteAnswers, scoreProfile } from "../lib/scoring";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(ITEMS.length === 36, "expected 36 items");

const scored = ITEMS.filter((item) => item.scored);
assert(scored.length === 30, "expected 30 scored items");
assert(ITEMS.filter((item) => item.format === "agreement").length === 20, "agreement count");
assert(ITEMS.filter((item) => item.format === "frequency").length === 10, "frequency count");
assert(ITEMS.filter((item) => item.format === "situational").length === 4, "situational count");
assert(ITEMS.filter((item) => item.format === "preference").length === 2, "preference count");

const prompts = new Set(ITEMS.map((item) => item.prompt));
assert(prompts.size === 36, "prompts should be unique");

for (const domain of DOMAINS) {
  const items = scored.filter((item) => item.domain === domain.id);
  assert(items.length === 6, `${domain.id} should have 6 items`);
  assert(items.filter((item) => item.reverse).length === 3, `${domain.id} reverse balance`);
  assert(items.filter((item) => item.format === "frequency").length === 2, `${domain.id} frequency`);
}

for (const facet of Object.keys(FACETS) as FacetId[]) {
  const items = scored.filter((item) => item.facet === facet);
  assert(items.length === 2, `${facet} should have 2 items`);
  assert(items.filter((item) => item.reverse).length === 1, `${facet} keying`);
}

let previous: DomainId | undefined;
for (const item of ITEMS) {
  if (!item.domain) {
    previous = undefined;
    continue;
  }
  assert(item.domain !== previous, `adjacent domain at ${item.id}`);
  previous = item.domain;
}

const profile = scoreProfile(sampleAnswers);
const byId = Object.fromEntries(profile.domains.map((domain) => [domain.id, domain]));
assert(byId.E.index === 79 && byId.E.pole === "high", "sample E");
assert(byId.A.index === 63 && byId.A.pole === "high", "sample A");
assert(byId.C.index === 33 && byId.C.pole === "low", "sample C");
assert(byId.N.index === 71 && byId.N.pole === "high", "sample N");
assert(byId.O.index === 83 && byId.O.pole === "high", "sample O");

const report = sampleReport();
assert(report.interactions.length >= 4, "sample should show combinations");
assert(report.qualitative.length === 6, "six qualitative notes");
assert(report.suggestions.length > 0 && report.suggestions.length <= 4, "suggestion cap");
assert(!report.overview.includes("درون‌گرا"), "no type label");
assert(!JSON.stringify(report).includes("ضریب پایایی"), "no fake reliability");

let threw = false;
try {
  scoreProfile({});
} catch (error) {
  threw = error instanceof IncompleteAnswers;
}
assert(threw, "incomplete answers should fail");

const built = buildReport(profile);
assert(built.domainTexts.length === 5, "five narratives");
assert(Boolean(built.fun?.voice && built.fun.animal.name && built.fun.food.name), "fun block");

console.log("instrument checks passed");
console.log(
  profile.domains.map((domain) => `${domain.id}:${domain.index}:${domain.pole}`).join(" "),
);
