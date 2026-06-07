# WordPress Migration — Dame Luthas

## Source: dameluthas.com

### Content Mapping

| WordPress | React Route | Supabase Table |
|-----------|-------------|----------------|
| portfolio page | `/portfolio` | `portfolio` |
| case-studies page | `/case-studies` | `case_studies` |
| services page | `/services` | `services` |
| about page | `/about` | `about` |
| contact page | `/contact` | `contact` |

### Extraction Pipeline
1. Restore WordPress from UpdraftPlus backup
2. Run GraphQL extractor: `npx tsx ../damieus-workflow-agents/scripts/scripts/extract-wordpress-content.ts`
3. Run CSS migration tool: `../damieus-workflow-agents/tools/css-migration-tool/`
4. Map extracted content to Supabase schema
5. Seed data into Supabase tables

### Media Assets
- Extract from wp-content/uploads/
- Upload to Supabase Storage or Vercel Blob
- Update image references in content
