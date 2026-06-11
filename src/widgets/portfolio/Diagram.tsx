import type { DiagramSkill } from "@/shared/types/portfolio-widgets";

interface DiagramProps {
  skills: DiagramSkill[];
  className?: string;
}

export function Diagram({ skills, className }: DiagramProps) {
  if (!skills.length) return null;

  return (
    <section className={className ?? "my-10"} aria-labelledby="portfolio-skills-heading">
      <h2 id="portfolio-skills-heading" className="mb-6 text-lg font-semibold text-white">
        Skills &amp; focus
      </h2>
      <ul className="space-y-4">
        {skills.map((skill) => (
          <li key={skill.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-zinc-300">{skill.label}</span>
              <span className="text-zinc-500">{skill.percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[var(--dl-accent)] transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, skill.percent))}%` }}
                role="progressbar"
                aria-valuenow={skill.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.label}: ${skill.percent}%`}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
