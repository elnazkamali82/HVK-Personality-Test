"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADULT_KEY } from "@/lib/storage";

export function StartForm({ variant = "panel" }: { variant?: "panel" | "hero" }) {
  const router = useRouter();
  const [adult, setAdult] = useState(false);

  return (
    <form
      className={variant === "hero" ? "hero-cta" : "panel"}
      onSubmit={(event) => {
        event.preventDefault();
        if (!adult) return;
        sessionStorage.setItem(ADULT_KEY, "yes");
        router.push("/test");
      }}
    >
      <label className="check">
        <input
          type="checkbox"
          checked={adult}
          onChange={(event) => setAdult(event.target.checked)}
        />
        <span>۱۸ سال یا بیشتر دارم و این نتیجه را فقط برای خودشناسی می‌خواهم.</span>
      </label>
      <button className="button button-primary button-lg" type="submit" disabled={!adult}>
        شروع آزمون
      </button>
    </form>
  );
}
