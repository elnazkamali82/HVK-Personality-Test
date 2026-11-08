"use client";

import { useRouter } from "next/navigation";
import { ADULT_KEY } from "@/lib/storage";

export function StartForm() {
  const router = useRouter();

  return (
    <form
      className="start-form"
      onSubmit={(event) => {
        event.preventDefault();
        sessionStorage.setItem(ADULT_KEY, "yes");
        router.push("/test");
      }}
    >
      <button className="start-cta" type="submit">
        شروع کنیم
        <span className="start-cta-arrow" aria-hidden="true">
          ←
        </span>
      </button>
    </form>
  );
}
