import Link from "next/link";

export function SiteHeader({ tone = "default" }: { tone?: "default" | "hero" }) {
  return (
    <header className={tone === "hero" ? "site-header site-header-hero" : "site-header"}>
      <Link className="brand" href="/">
        پنج‌رخ
      </Link>
      <nav className="site-nav">
        <Link href="/basis">مبانی</Link>
        <Link href="/sample">نمونه گزارش</Link>
      </nav>
    </header>
  );
}
