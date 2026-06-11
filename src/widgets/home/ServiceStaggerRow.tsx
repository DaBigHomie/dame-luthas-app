"use client";

import type { ServiceCategory } from "@/content/types";
import { ScrollParallax } from "@/shared/ui/ScrollParallax";
import { StyledImage } from "@/shared/ui/StyledImage";

import { ServiceCard } from "./ServiceCard";

interface ServiceStaggerRowProps {
  category: ServiceCategory;
}

export function ServiceStaggerRow({ category }: ServiceStaggerRowProps) {
  const position = category.imagePosition ?? "left";

  return (
    <div
      className={`dl-service-stagger-row dl-service-stagger-row--${position}`}
    >
      <ScrollParallax className="w-full">
        <StyledImage
          src={category.image}
          alt={category.title}
          position={position}
        />
      </ScrollParallax>
      <div className="dl-service-stagger-content relative z-[1]">
        <ServiceCard category={category} eyebrow={category.eyebrow} />
      </div>
    </div>
  );
}
