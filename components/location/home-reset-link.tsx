"use client";

import Link from "next/link";

export function HomeResetLink() {
  return (
    <Link
      className="map-header__brand"
      href="/"
      aria-label="GDZIEWC.PL — wróć do strony startowej"
      onClick={(event) => {
        if (window.location.pathname !== "/") return;
        event.preventDefault();
        window.location.reload();
      }}
    >
      <span className="map-header__wordmark"><b>GDZIE</b>WC.PL</span>
      <small>START</small>
    </Link>
  );
}
