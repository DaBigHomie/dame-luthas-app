import type { ServiceBlock } from "@/content/types";

import { ServiceStaggerRow } from "./ServiceStaggerRow";

interface ServiceBlockSectionProps {
  block: ServiceBlock;
  id?: string;
}

export function ServiceBlockSection({ block, id }: ServiceBlockSectionProps) {
  return (
    <section
      id={id}
      className="dl-service-block border-t border-white/10 py-16"
      aria-label={`Services ${block.slide}`}
    >
      <div className="relative mx-auto max-w-[var(--dl-container-max)] px-[21px]">
        <p
          className="dl-services-watermark hidden lg:block"
          aria-hidden="true"
        >
          services
        </p>

        <p className="relative z-[1] mb-10 text-xs uppercase tracking-[0.3em] text-[var(--dl-accent)]">
          services {block.slide}
        </p>

        <div className="relative z-[1] space-y-12">
          {block.categories.map((category, index) => (
            <div key={category.id}>
              {index > 0 ? (
                <hr className="dl-service-stagger-divider" aria-hidden="true" />
              ) : null}
              <ServiceStaggerRow category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
