/**
 * SSR entry used only at build time by `script/prerender.ts`.
 * Never shipped to the browser.
 */
import { renderToString } from "react-dom/server";
import App from "./App";
import { preloadPages } from "./pages/registry";

/** Must be awaited once before the first `render()` call. */
export async function prepare(): Promise<void> {
  await preloadPages();
}

export function render(url: string): string {
  return renderToString(<App ssrPath={url} />);
}
