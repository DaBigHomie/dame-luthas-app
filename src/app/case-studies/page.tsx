import { notFound } from "next/navigation";

import { isMigratedAvailable } from "@/shared/lib/migrated/content";
import { CaseStudiesPage } from "@/widgets/CaseStudiesPage";

export default function CaseStudiesRoute() {
  if (!isMigratedAvailable()) notFound();
  return <CaseStudiesPage />;
}
