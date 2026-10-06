import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

test("every service phone anchor tracks one click without cancelling tel navigation", () => {
  let linkCount = 0;
  for (const directory of ["client/src/components", "client/src/pages"]) {
    for (const file of readdirSync(directory).filter((file) => file.endsWith(".tsx"))) {
      const path = `${directory}/${file}`;
      const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const visit = (node: ts.Node) => {
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === "a") {
          const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
          const href = attrs.find((attr) => attr.name.getText(source) === "href")?.initializer;
          if (href && (href.getText(source) === "{PHONE_HREF}" || /tel:/.test(href.getText(source)))) {
            linkCount++;
            const click = attrs.find((attr) => attr.name.getText(source) === "onClick")?.initializer;
            assert.ok(click && ts.isJsxExpression(click) && click.expression, `${path}: phone link needs click tracking`);
            const calls: unknown[] = [];
            // Execute the actual inline handler, not a replacement handler.
            const handler = new Function("trackServicePhoneClick", `return (${click.expression.getText(source)});`)(
              (location: string) => { calls.push(location); },
            );
            const result = handler({
              preventDefault: () => assert.fail(`${path}: must not cancel dialing`),
              stopPropagation: () => assert.fail(`${path}: must not stop click propagation`),
            });
            assert.equal(result, undefined, `${path}: must not await analytics or return false`);
            const expected = file === "Header.tsx"
              ? ["header_top", "header_desktop", "header_mobile"]
              : [file === "Footer.tsx" ? "footer" : file === "ServiceCard.tsx" ? "service_card" : "page_cta"];
            assert.equal(calls.length, 1, `${path}: exactly one event per click`);
            assert.ok(expected.includes(calls[0] as string), `${path}: fixed placement label`);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  }
  assert.equal(linkCount, 18, "all current service phone links remain instrumented");
});
