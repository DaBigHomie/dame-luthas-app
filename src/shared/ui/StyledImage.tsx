import Image from "next/image";

export type StyledImagePosition = "left" | "right";

export interface StyledImageProps {
  src: string;
  alt?: string;
  position?: StyledImagePosition;
  /** Enables future scroll-parallax hook (TheGem vertical_scroll). */
  parallax?: boolean;
  className?: string;
}

/**
 * TheGem `thegem-styledimage` — gem-wrapbox markup for service stagger rows.
 */
export function StyledImage({
  src,
  alt = "",
  position = "left",
  parallax = false,
  className = "",
}: StyledImageProps) {
  const positionClass =
    position === "right"
      ? "gem-wrapbox-position-right"
      : "gem-wrapbox-position-left";

  return (
    <div
      className={`styled-image-wrapper ${className}`.trim()}
      data-thegem-parallax={parallax ? "vertical" : undefined}
    >
      <div
        className={`gem-image gem-wrapbox gem-wrapbox-default ${positionClass}`}
      >
        <div className="gem-wrapbox-inner">
          <Image
            src={src}
            alt={alt}
            width={960}
            height={640}
            className="gem-wrapbox-element img-responsive h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
