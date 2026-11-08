import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
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
