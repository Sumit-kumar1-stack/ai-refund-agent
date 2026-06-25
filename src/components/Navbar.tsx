"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="
      sticky
      top-0
      z-50
      bg-black/40
      backdrop-blur-xl
      border-b
      border-white/10
      "
    >
      <div
        className="
        mx-auto
        max-w-7xl
        px-6
        py-4
        flex
        justify-between
        items-center
        "
      >
        <Link
          href="/"
          className="
          text-3xl
          font-black
          bg-gradient-to-r
          from-blue-400
          to-cyan-400
          bg-clip-text
          text-transparent
          "
        >
          RefundAI
        </Link>

        <div className="flex gap-6">

          <Link
            href="/"
            className="hover:text-cyan-300"
          >
            Customer
          </Link>

          <Link
            href="/admin"
            className="hover:text-cyan-300"
          >
            Dashboard
          </Link>

        </div>
      </div>
    </nav>
  );
}