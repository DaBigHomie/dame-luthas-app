"use client";

import { useState } from "react";

interface PortfolioFilterMenuProps {
  labels: string[];
  active: string;
  onSelect: (label: string) => void;
}

export function PortfolioFilterMenu({
  labels,
  active,
  onSelect,
}: PortfolioFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [animClass, setAnimClass] = useState<"dl-animate-in" | "dl-animate-out" | "">(
    "",
  );

  function close() {
    setAnimClass("dl-animate-out");
    window.setTimeout(() => {
      setOpen(false);
      setAnimClass("");
    }, 400);
  }

  function openMenu() {
    setOpen(true);
    setAnimClass("dl-animate-in");
    window.setTimeout(() => setAnimClass(""), 300);
  }

  function toggle() {
    if (open) close();
    else openMenu();
  }

  return (
    <div className="dl-gem-portfolio-filters mb-8 md:hidden">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white"
        aria-expanded={open}
      >
        <span>{active}</span>
        <span className="text-zinc-400" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open ? (
        <ul
          className={`dl-gem-portfolio-filters__menu mt-2 space-y-1 rounded-xl border border-white/10 bg-[var(--dl-surface)] p-2 ${animClass}`}
          role="listbox"
        >
          {labels.map((label) => (
            <li key={label} role="option" aria-selected={label === active}>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/5"
                onClick={() => {
                  onSelect(label);
                  close();
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
