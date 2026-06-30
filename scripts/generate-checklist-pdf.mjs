import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const OUT = "client/public/golf-cart-maintenance-checklist.pdf";

const PAGE_W = 612;
const PAGE_H = 792;
const LEFT = 54;

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

const ops = [];
let y = PAGE_H - 60;

function text(str, { font = "F1", size = 10, x = LEFT, gap = 16 } = {}) {
  ops.push(`BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${esc(str)}) Tj ET`);
  y -= gap;
}

function rule() {
  ops.push(`${LEFT} ${y + 6} m ${PAGE_W - LEFT} ${y + 6} l 0.85 0.41 0.18 RG 1 w S`);
  y -= 10;
}

function items(list) {
  for (const it of list) {
    ops.push(
      `${LEFT} ${y - 1} ${8} ${8} re 0.6 0.6 0.6 RG 0.8 w S`,
    );
    ops.push(
      `BT /F1 10 Tf 1 0 0 1 ${LEFT + 16} ${y} Tm (${esc(it)}) Tj ET`,
    );
    y -= 15;
  }
  y -= 6;
}

text("Golf Cart Maintenance Checklist", { font: "F2", size: 20, gap: 20 });
text("Affordable Golf Cart Service  |  1-844-844-4070  |  affordablegolfcartservice.com", {
  size: 9.5,
  gap: 14,
});
rule();
y -= 4;

text("MONTHLY MAINTENANCE", { font: "F2", size: 12, gap: 18 });
items([
  "Check battery water levels (top off lead-acid cells with distilled water)",
  "Clean battery terminals and check for corrosion",
  "Check tire pressure and inspect tread for wear",
  "Test lights, turn signals, horn, and gauges",
  "Inspect brakes for responsiveness and unusual noise",
  "Wash the cart and check the body for damage",
]);

text("SEASONAL MAINTENANCE", { font: "F2", size: 12, gap: 18 });
items([
  "Inspect and tighten all electrical connections",
  "Test charger output and inspect charging cables",
  "Check brake pads/shoes and adjust brake cables",
  "Inspect suspension, steering, and wheel bearings",
  "Lubricate moving parts and check for fluid leaks",
  "Inspect motor brushes and listen for unusual motor noise",
]);

text("ANNUAL MAINTENANCE", { font: "F2", size: 12, gap: 18 });
items([
  "Perform a full battery load test on every battery",
  "Replace worn brake components and service brake system",
  "Inspect and service the motor and speed controller",
  "Check and replace tires that are worn or cracked",
  "Complete a full multi-point safety inspection",
  "Schedule professional service for anything beyond DIY",
]);

text("STORAGE PREP (before long-term storage)", { font: "F2", size: 12, gap: 18 });
items([
  "Fully charge batteries and disconnect the main connector",
  "Clean terminals and apply anti-corrosion protectant",
  "Store in a cool, dry place and elevate or inflate tires",
  "Top off charge periodically during long storage",
]);

y -= 8;
rule();
text("Need help? Call Affordable Golf Cart Service at 1-844-844-4070 for expert golf cart maintenance.", {
  size: 9.5,
  gap: 14,
});

const content = ops.join("\n");

const objects = [];
objects.push(`<< /Type /Catalog /Pages 2 0 R >>`);
objects.push(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`);
objects.push(
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
);
objects.push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);

let pdf = "%PDF-1.4\n";
const offsets = [];
objects.forEach((obj, i) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
});

const xrefStart = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += `0000000000 65535 f \n`;
offsets.forEach((off) => {
  pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
});
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, pdf, "latin1");
console.log(`Wrote ${OUT} (${Buffer.byteLength(pdf)} bytes)`);
