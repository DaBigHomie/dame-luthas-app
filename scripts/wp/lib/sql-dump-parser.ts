/**
 * Minimal mysqldump INSERT row parser for wp_posts tuples.
 * No MySQL server required — reads the UpdraftPlus .sql file directly.
 */

export interface WpPostRow {
  id: number;
  postTitle: string;
  postContent: string;
  postExcerpt: string;
  postStatus: string;
  postName: string;
  postType: string;
  postDate: string;
  guid: string;
}

/** Parse one MySQL VALUES tuple: (1, 2, 'str', ...) */
export function parseMysqlTuple(raw: string): string[] {
  const values: string[] = [];
  let i = 0;
  const input = raw.trim().replace(/^\(/, "").replace(/\)$/, "");

  while (i < input.length) {
    while (i < input.length && (input[i] === " " || input[i] === ",")) i++;
    if (i >= input.length) break;

    if (input[i] === "'") {
      let value = "";
      i++;
      while (i < input.length) {
        const ch = input[i];
        if (ch === "\\" && i + 1 < input.length) {
          value += input[i + 1];
          i += 2;
          continue;
        }
        if (ch === "'") {
          if (input[i + 1] === "'") {
            value += "'";
            i += 2;
            continue;
          }
          i++;
          break;
        }
        value += ch;
        i++;
      }
      values.push(value);
      continue;
    }

    if (input.slice(i, i + 4).toUpperCase() === "NULL") {
      values.push("");
      i += 4;
      continue;
    }

    let token = "";
    while (i < input.length && input[i] !== ",") {
      token += input[i];
      i++;
    }
    values.push(token.trim());
  }

  return values;
}

export function rowToWpPost(fields: string[]): WpPostRow | null {
  if (fields.length < 21) return null;
  return {
    id: Number(fields[0]) || 0,
    postDate: fields[2] ?? "",
    postContent: fields[4] ?? "",
    postTitle: fields[5] ?? "",
    postExcerpt: fields[6] ?? "",
    postStatus: fields[7] ?? "",
    postName: fields[11] ?? "",
    guid: fields[18] ?? "",
    postType: fields[20] ?? "",
  };
}

/** Split INSERT body into individual row tuples. */
export function splitInsertTuples(sqlBody: string): string[] {
  const tuples: string[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < sqlBody.length; i++) {
    const ch = sqlBody[i];
    if (ch === "(") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === ")") {
      depth--;
      if (depth === 0 && start >= 0) {
        tuples.push(sqlBody.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return tuples;
}

export function extractWpPostsFromDump(sql: string): WpPostRow[] {
  const marker = "INSERT INTO `wp_posts` VALUES ";
  const rows: WpPostRow[] = [];
  let searchFrom = 0;

  while (true) {
    const idx = sql.indexOf(marker, searchFrom);
    if (idx === -1) break;

    const start = idx + marker.length;
    let end = sql.indexOf(";\n", start);
    if (end === -1) end = sql.length;

    const body = sql.slice(start, end);
    for (const tuple of splitInsertTuples(body)) {
      const fields = parseMysqlTuple(tuple);
      const row = rowToWpPost(fields);
      if (row) rows.push(row);
    }

    searchFrom = end;
  }

  return rows;
}

const DEMO_SLUG_RE =
  /navigation|demo|elementor|codex-themes|template|header|footer|slide/i;

export function isPilotContent(row: WpPostRow): boolean {
  if (row.postStatus !== "publish") return false;
  if (DEMO_SLUG_RE.test(row.postName) || DEMO_SLUG_RE.test(row.postTitle)) {
    return false;
  }
  if (row.postType === "attachment") return false;
  if (row.postType === "revision") return false;
  if (row.postType === "nav_menu_item") return false;
  if (row.postType.startsWith("elementor")) return false;
  if (row.postType.startsWith("wp_")) return false;
  if (row.postType.startsWith("thegem_") && row.postType !== "thegem_pf_item") {
    return false;
  }
  return ["page", "post", "thegem_pf_item"].includes(row.postType);
}
