import { Route, Router, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Page, type PageName } from "@/pages/registry";
import { ROUTER_BASE } from "@/lib/site";

/** path -> page, in wouter match order (most specific first). */
const ROUTES: Array<[string, PageName]> = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/services/golf-cart-repair", "GolfCartRepair"],
  ["/services/electrical-diagnostics", "ElectricalDiagnostics"],
  ["/services/mobile-golf-cart-service", "MobileService"],
  ["/services/golf-cart-tune-up", "GolfCartMaintenance"],
  ["/services/club-car-repair", "ClubCarRepair"],
  ["/services/motor-repair", "MotorRepair"],
  ["/services/golf-cart-alignment", "GolfCartAlignment"],
  ["/services/:id", "Services"],
  ["/blog/golf-cart-repair-cost", "RepairCostGuide"],
  ["/states", "States"],
  ["/states/:slug", "States"],
  ["/locations", "Locations"],
  ["/locations/:slug", "Locations"],
  ["/contact", "Contact"],
];

/**
 * Which page a pathname resolves to, using the same table and the same order as
 * <Switch>. Used by the browser entry to load the route's chunk *before*
 * hydrating, so the first client render matches the prerendered markup exactly.
 */
export function pageNameForPath(pathname: string): PageName {
  let rel = pathname;
  if (ROUTER_BASE && rel.startsWith(ROUTER_BASE)) rel = rel.slice(ROUTER_BASE.length) || "/";
  rel = rel.replace(/\/+$/, "") || "/";
  for (const [pattern, name] of ROUTES) {
    const source = "^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$";
    if (new RegExp(source).test(rel)) return name;
  }
  return "NotFound";
}

function Routes() {
  return (
    <Switch>
      {ROUTES.map(([path, name]) => (
        <Route key={path} path={path}>
          {(params) => <Page name={name} {...params} />}
        </Route>
      ))}
      <Route>{() => <Page name="NotFound" />}</Route>
    </Switch>
  );
}

/**
 * `ssrPath` is supplied only by the prerenderer (`script/prerender.ts`); in the
 * browser wouter reads the real location. `base` keeps every route correct when
 * the site is deployed under a project-page sub-path.
 */
export default function App({ ssrPath }: { ssrPath?: string } = {}) {
  return (
    <Router base={ROUTER_BASE} ssrPath={ssrPath}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </Router>
  );
}
