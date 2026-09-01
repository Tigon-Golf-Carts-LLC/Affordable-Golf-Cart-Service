/**
 * Route component registry.
 *
 * Every page is loaded through a dynamic import so Rollup emits one chunk per
 * route — a visitor to /contact never downloads the 1,500-line services page.
 *
 * The same registry serves the build-time prerenderer, which cannot suspend:
 * `preloadPages()` awaits every chunk and fills `loaded`, so by the time
 * `renderToString` runs, `<Page>` resolves synchronously and never throws.
 * In the browser `loaded` starts empty, so `<Page>` falls back to React.lazy
 * inside a Suspense boundary — and because the markup is prerendered, React
 * keeps the server HTML in place until the chunk arrives.
 */
import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";

type PageComponent = ComponentType<any>;
type Loader = () => Promise<{ default: PageComponent }>;

export const pageLoaders = {
  Home: () => import("@/pages/Home"),
  About: () => import("@/pages/About"),
  Services: () => import("@/pages/Services"),
  GolfCartRepair: () => import("@/pages/GolfCartRepair"),
  ElectricalDiagnostics: () => import("@/pages/ElectricalDiagnostics"),
  MobileService: () => import("@/pages/MobileService"),
  GolfCartMaintenance: () => import("@/pages/GolfCartMaintenance"),
  ClubCarRepair: () => import("@/pages/ClubCarRepair"),
  MotorRepair: () => import("@/pages/MotorRepair"),
  GolfCartAlignment: () => import("@/pages/GolfCartAlignment"),
  RepairCostGuide: () => import("@/pages/RepairCostGuide"),
  States: () => import("@/pages/States"),
  Locations: () => import("@/pages/Locations"),
  Contact: () => import("@/pages/Contact"),
  NotFound: () => import("@/pages/not-found"),
} satisfies Record<string, Loader>;

export type PageName = keyof typeof pageLoaders;

const loaded = new Map<PageName, PageComponent>();
const lazies = new Map<PageName, LazyExoticComponent<PageComponent>>();

/** Warm one route's chunk. Resolves immediately if it is already loaded. */
export async function loadPage(name: PageName): Promise<void> {
  if (loaded.has(name)) return;
  loaded.set(name, (await pageLoaders[name]()).default);
}

/** Build-time only: warm every chunk so SSR rendering never suspends. */
export async function preloadPages(): Promise<void> {
  await Promise.all((Object.keys(pageLoaders) as PageName[]).map(loadPage));
}

function lazyFor(name: PageName): LazyExoticComponent<PageComponent> {
  let component = lazies.get(name);
  if (!component) {
    component = lazy(pageLoaders[name]);
    lazies.set(name, component);
  }
  return component;
}

/** Placeholder shown only on a client-side navigation to a not-yet-loaded route. */
function PageFallback() {
  return <div className="min-h-[60vh]" aria-busy="true" />;
}

/**
 * Renders a route's page component. `wouter` passes route params through, so
 * this forwards every prop it receives.
 *
 * The Suspense boundary is always present, even when the component is already
 * loaded. React derives `useId` values from the shape of the tree, so a
 * boundary that exists on the client but not in the prerendered markup would
 * desynchronise every generated id and fail hydration.
 */
export function Page({ name, ...props }: { name: PageName } & Record<string, unknown>) {
  const Component = loaded.get(name) ?? lazyFor(name);
  return (
    <Suspense fallback={<PageFallback />}>
      <Component {...props} />
    </Suspense>
  );
}
