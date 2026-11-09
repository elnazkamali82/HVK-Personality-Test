"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsClient } from "@/components/use-is-client";
import { fa } from "@/lib/format";
import { getSessionItems, type Item, type ResponseFormat } from "@/lib/instrument";
import { ADULT_KEY, ANSWERS_KEY } from "@/lib/storage";

const HINT: Record<ResponseFormat, string> = {
  agreement: "بر اساس رفتار معمول چند ماه اخیر.",
  frequency: "چقدر این رفتار را واقعاً داری.",
  situational: "واکنشی را انتخاب کن که محتمل‌تر است.",
  preference: "اگر فقط یکی را بتوانی انتخاب کنی.",
};

function readAnswers(): Record<string, number> {
  const saved = sessionStorage.getItem(ANSWERS_KEY);
  if (!saved) return {};
  try {
    const parsed = JSON.parse(saved) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    sessionStorage.removeItem(ANSWERS_KEY);
    return {};
  }
}

function startingIndex(items: Item[], answers: Record<string, number>) {
  const firstOpen = items.findIndex((item) => answers[item.id] === undefined);
  return firstOpen === -1 ? items.length - 1 : firstOpen;
}

export function TestRunner() {
  const router = useRouter();
  const isClient = useIsClient();
  const [items, setItems] = useState<Item[] | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (isClient && items === null) {
    const sessionItems = getSessionItems();
    const stored = readAnswers();
    setItems(sessionItems);
    setAnswers(stored);
    setIndex(startingIndex(sessionItems, stored));
  }

  const adult = isClient && sessionStorage.getItem(ADULT_KEY) === "yes";

  useEffect(() => {
    if (isClient && !adult) router.replace("/");
  }, [adult, isClient, router]);

  if (!isClient || index === null || items === null) {
    return <p>در حال باز کردن آزمون…</p>;
  }

  if (!adult) {
    return <p>این نسخه برای ۱۸ سال به بالاست.</p>;
  }

  const item = items[index]!;
  const selected = answers[item.id];
  const isScale = item.format === "agreement" || item.format === "frequency";

  function choose(value: number) {
    const next = { ...answers, [item.id]: value };
    setAnswers(next);
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(next));
  }

  return (
    <section
      className="test-shell"
      key={item.id}
      onKeyDown={(event) => {
        const number = Number(event.key);
        if (!Number.isInteger(number) || number < 1 || number > item.options.length) return;
        choose(number);
      }}
    >
      <div className="test-progress-label">
        <span>
          سؤال {fa(item.order)} از {fa(items.length)}
        </span>
        <span>{fa(Math.round(((index + 1) / items.length) * 100))}٪</span>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / items.length) * 100}%` }} />
      </div>
      <p className="test-hint">{HINT[item.format]}</p>
      <h1 className="prompt">{item.prompt}</h1>
      <div
        className={`options${isScale ? " options-scale" : ""}`}
        role="radiogroup"
        aria-label={item.prompt}
      >
        {item.options.map((option) => {
          const checked = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              className="option"
              onClick={() => choose(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="actions">
        <button
          type="button"
          className="button button-ghost"
          onClick={() => setIndex((current) => Math.max(0, (current ?? 0) - 1))}
          disabled={index === 0}
        >
          قبلی
        </button>
        {index < items.length - 1 ? (
          <button
            type="button"
            className="button button-primary"
            disabled={selected === undefined}
            onClick={() => setIndex((current) => (current ?? 0) + 1)}
          >
            بعدی
          </button>
        ) : (
          <button
            type="button"
            className="button button-primary"
            disabled={selected === undefined || Object.keys(answers).length < items.length}
            onClick={() => router.push("/result")}
          >
            دیدن نیمرخ
          </button>
        )}
      </div>
    </section>
  );
}
