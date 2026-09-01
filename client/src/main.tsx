import { createRoot, hydrateRoot } from "react-dom/client";
import App, { pageNameForPath } from "./App";
import { loadPage } from "./pages/registry";
import "./index.css";

const container = document.getElementById("root")!;

async function start() {
  // Every route ships prerendered markup (script/prerender.ts). Load this
  // route's chunk first so the initial client render is synchronous and
  // identical to that markup, then hydrate it instead of throwing it away.
  // `npm run dev` serves an empty shell and falls through to createRoot.
  if (container.dataset.prerendered === "true") {
    await loadPage(pageNameForPath(window.location.pathname));
    hydrateRoot(container, <App />);
  } else {
    createRoot(container).render(<App />);
  }
}

void start();
