import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import GolfCartRepair from "@/pages/GolfCartRepair";
import ElectricalDiagnostics from "@/pages/ElectricalDiagnostics";
import MobileService from "@/pages/MobileService";
import GolfCartMaintenance from "@/pages/GolfCartMaintenance";
import ClubCarRepair from "@/pages/ClubCarRepair";
import MotorRepair from "@/pages/MotorRepair";
import RepairCostGuide from "@/pages/RepairCostGuide";
import States from "@/pages/States";
import Locations from "@/pages/Locations";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/services/golf-cart-repair" component={GolfCartRepair} />
      <Route path="/services/electrical-diagnostics" component={ElectricalDiagnostics} />
      <Route path="/services/mobile-golf-cart-service" component={MobileService} />
      <Route path="/services/golf-cart-tune-up" component={GolfCartMaintenance} />
      <Route path="/services/club-car-repair" component={ClubCarRepair} />
      <Route path="/services/motor-repair" component={MotorRepair} />
      <Route path="/services/:id" component={Services} />
      <Route path="/blog/golf-cart-repair-cost" component={RepairCostGuide} />
      <Route path="/states" component={States} />
      <Route path="/states/:slug" component={States} />
      <Route path="/locations" component={Locations} />
      <Route path="/locations/:slug" component={Locations} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
