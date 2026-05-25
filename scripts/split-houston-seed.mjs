import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sql = readFileSync(join(root, "supabase/seed_houston_cypress.sql"), "utf8");

const header = `insert into public.restaurants (
  owner_id, name, description, location, cuisine_type, image_url,
  capacity, is_featured, display_rank, tags, price_level, event_types,
  latitude, longitude, city, status, is_visible, subscription_status
) values
`;

const deleteStmt = `delete from public.restaurants
where city in ('houston', 'cypress')
  and owner_id is null;

`;

const body = sql.split("values\n")[1].replace(/\);\s*[\s\S]*$/, "").trim();
const rows = body.split(/\),\s*\n\(/).map((chunk, i, arr) => {
  let r = chunk.trim();
  if (!r.startsWith("(")) r = "(" + r;
  if (!r.endsWith(")")) r = r + ")";
  return r;
});

const PARTS = 4;
const perPart = Math.ceil(rows.length / PARTS);

for (let p = 0; p < PARTS; p++) {
  const slice = rows.slice(p * perPart, (p + 1) * perPart);
  const values = slice.join(",\n");
  const prefix =
    p === 0
      ? `-- Part ${p + 1}/${PARTS}: run first (includes delete)\n${deleteStmt}`
      : `-- Part ${p + 1}/${PARTS}: run after part ${p}\n`;
  const out = `${prefix}${header}${values};\n`;
  const path = join(root, "supabase", `seed_houston_cypress_part${p + 1}.sql`);
  writeFileSync(path, out, "utf8");
  console.log(`Wrote ${path} (${slice.length} rows)`);
}
