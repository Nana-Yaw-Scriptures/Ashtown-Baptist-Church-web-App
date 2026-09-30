"use client";

import { useState } from "react";
import type { GalleryItem } from "@/lib/types";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setActive(it)}
            className="group text-left"
          >
            <div className="overflow-hidden rounded-xl2 border border-mist bg-white aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image_url}
                alt={it.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-2 text-sm font-medium">{it.title}</p>
            {it.category === "flyer" && (
              <span className="text-xs text-sage">Flyer</span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image_url}
              alt={active.title}
              className="w-full max-h-[80vh] object-contain rounded-xl2"
            />
            <div className="mt-3 text-center text-white">
              <p className="font-medium">{active.title}</p>
              {active.caption && (
                <p className="text-sm text-white/70">{active.caption}</p>
              )}
            </div>
            <button
              onClick={() => setActive(null)}
              className="mt-3 mx-auto block text-sm text-white/80 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
