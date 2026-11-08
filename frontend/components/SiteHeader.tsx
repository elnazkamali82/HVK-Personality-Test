import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        پنج‌رخ
      </Link>
      <nav className="site-nav" aria-label="ناوبری اصلی">
        <Link href="/basis">مبانی</Link>
        <Link href="/sample">نمونه</Link>
      </nav>
    </header>
  );
}
