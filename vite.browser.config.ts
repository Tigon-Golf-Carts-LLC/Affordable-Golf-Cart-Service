import { mergeConfig } from "vite";
import staticConfig from "./vite.static.config";

// Keep the real frontend setup but never point regression tests at the hosted
// relay. These relative endpoints are intercepted and Vite has no delivery API.
export default mergeConfig(staticConfig, {
  define: {
    "import.meta.env.VITE_LEAD_RELAY_URL": JSON.stringify("/api/tigon-leads"),
    "import.meta.env.VITE_INQUIRY_RELAY_URL": JSON.stringify("/api/tigon-inquiries"),
  },
});
