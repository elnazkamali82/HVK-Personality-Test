import Image from "next/image";
import Link from "next/link";
import { StartForm } from "@/components/StartForm";

export default function HomePage() {
  return (
    <main className="home-shell">
      <header className="home-top">
        <Link className="home-logo" href="/">
          پنج‌رخ
        </Link>
        <nav className="home-nav" aria-label="پیوندهای کوتاه">
          <Link href="/basis">مبانی</Link>
          <Link href="/sample">نمونه</Link>
        </nav>
      </header>

      <section className="home-stage">
        <div className="home-figure" aria-hidden="true">
          <Image
            src="/character.png"
            alt=""
            width={720}
            height={900}
            priority
            className="home-character"
          />
        </div>

        <div className="home-copy">
          <h1 className="home-brand">پنج‌رخ</h1>
          <p className="home-line">آماده‌ای خودت را پیدا کنی؟</p>
          <p className="home-meta">حدود ده دقیقه · بدون پاسخ درست یا غلط</p>
          <StartForm />
        </div>
      </section>
    </main>
  );
}
