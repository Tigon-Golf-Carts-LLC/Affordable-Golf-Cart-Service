export interface Service {
  id: string;
  name: string;
  priceRange: string;
  category: string;
  description: string;
}

export const serviceCategories = [
  "Maintenance & Tune-Ups",
  "Battery Services",
  "Tires & Wheels",
  "Brakes & Suspension",
  "Electrical & Motor",
  "Body & Exterior",
  "Accessories & Upgrades",
  "Inspections & Diagnostics",
  "Cleaning & Detailing",
  "Seasonal Services"
];

export const services: Service[] = [
  { id: "annual-inspection", name: "Annual Inspection", priceRange: "$99–$289", category: "Inspections & Diagnostics", description: "Comprehensive yearly check-up to ensure your golf cart is running safely and efficiently." },
  { id: "basic-tune-up", name: "Basic Tune-Up", priceRange: "$100–$300", category: "Maintenance & Tune-Ups", description: "Essential maintenance to keep your cart running smoothly with basic adjustments and checks." },
  { id: "full-tune-up-package", name: "Full Tune-Up Package", priceRange: "$180–$450", category: "Maintenance & Tune-Ups", description: "Complete tune-up service including all components inspection, adjustment, and optimization." },
  { id: "preventative-maintenance-service", name: "Preventative Maintenance Service", priceRange: "$150–$400", category: "Maintenance & Tune-Ups", description: "Proactive care to prevent future breakdowns and extend your cart's lifespan." },
  { id: "oil-change-gas-golf-cart", name: "Oil Change (Gas Golf Cart)", priceRange: "$50–$200", category: "Maintenance & Tune-Ups", description: "Fresh oil change for gas-powered golf carts to maintain engine health." },
  { id: "air-filter-replacement", name: "Air Filter Replacement", priceRange: "$20–$150", category: "Maintenance & Tune-Ups", description: "Replace clogged air filters for better engine performance and fuel efficiency." },
  { id: "spark-plug-replacement", name: "Spark Plug Replacement", priceRange: "$20–$160", category: "Maintenance & Tune-Ups", description: "New spark plugs for improved ignition and engine performance." },
  { id: "battery-load-test", name: "Battery Load Test", priceRange: "$30–$160", category: "Battery Services", description: "Test battery capacity and health to ensure reliable power." },
  { id: "battery-terminal-cleaning", name: "Battery Terminal Cleaning", priceRange: "$20–$150", category: "Battery Services", description: "Clean corrosion and buildup from battery terminals for better connection." },
  { id: "lead-acid-battery-replacement-set", name: "Lead-Acid Battery Replacement (Set)", priceRange: "$700–$1,300", category: "Battery Services", description: "Complete replacement of lead-acid battery pack for restored range and power." },
  { id: "lithium-battery-replacement-set", name: "Lithium Battery Replacement (Set)", priceRange: "$1,800–$3,600", category: "Battery Services", description: "Upgrade or replace with high-performance lithium battery system." },
  { id: "battery-installation-labor", name: "Battery Installation Labor", priceRange: "$100–$500", category: "Battery Services", description: "Professional installation of new batteries with proper connections." },
  { id: "charger-inspection-or-repair", name: "Charger Inspection or Repair", priceRange: "$50–$250", category: "Battery Services", description: "Diagnose and fix charger issues to ensure proper battery charging." },
  { id: "tire-rotation", name: "Tire Rotation", priceRange: "$20–$150", category: "Tires & Wheels", description: "Rotate tires for even wear and extended tire life." },
  { id: "tire-replacement-per-tire", name: "Tire Replacement (Per Tire)", priceRange: "$50–$200", category: "Tires & Wheels", description: "Replace worn or damaged tires with quality replacements." },
  { id: "wheel-alignment", name: "Wheel Alignment", priceRange: "$75–$300", category: "Tires & Wheels", description: "Precision alignment for better handling and reduced tire wear." },
  { id: "brake-inspection", name: "Brake Inspection", priceRange: "$30–$175", category: "Brakes & Suspension", description: "Thorough inspection of brake system components and performance." },
  { id: "brake-pad-replacement", name: "Brake Pad Replacement", priceRange: "$75–$300", category: "Brakes & Suspension", description: "Replace worn brake pads for safe stopping power." },
  { id: "brake-drum-replacement", name: "Brake Drum Replacement", priceRange: "$75–$300", category: "Brakes & Suspension", description: "New brake drums for reliable braking performance." },
  { id: "steering-adjustment", name: "Steering Adjustment", priceRange: "$50–$220", category: "Brakes & Suspension", description: "Fine-tune steering for precise control and comfortable handling." },
  { id: "suspension-lubrication", name: "Suspension Lubrication", priceRange: "$40–$180", category: "Brakes & Suspension", description: "Lubricate suspension components for smooth ride quality." },
  { id: "shock-absorber-replacement", name: "Shock Absorber Replacement", priceRange: "$150–$500", category: "Brakes & Suspension", description: "Replace worn shocks for improved ride comfort and handling." },
  { id: "front-end-service", name: "Front End Service", priceRange: "$80–$300", category: "Brakes & Suspension", description: "Complete front end inspection and service for optimal performance." },
  { id: "steering-and-alignment-diagnostic", name: "Steering and Alignment Diagnostic", priceRange: "$50–$250", category: "Inspections & Diagnostics", description: "Comprehensive diagnosis of steering and alignment issues." },
  { id: "electrical-diagnostic-service", name: "Electrical Diagnostic Service", priceRange: "$75–$250", category: "Electrical & Motor", description: "Expert diagnosis of electrical problems and system faults." },
  { id: "wiring-harness-repair", name: "Wiring Harness Repair", priceRange: "$100–$450", category: "Electrical & Motor", description: "Repair or replace damaged wiring for reliable electrical function." },
  { id: "controller-replacement", name: "Controller Replacement", priceRange: "$300–$1,000", category: "Electrical & Motor", description: "Replace faulty motor controller for proper speed and power control." },
  { id: "motor-repair-or-rebuild", name: "Motor Repair or Rebuild", priceRange: "$400–$1,000", category: "Electrical & Motor", description: "Expert motor repair or complete rebuild for restored performance." },
  { id: "electric-motor-replacement", name: "Electric Motor Replacement", priceRange: "$500–$1,600", category: "Electrical & Motor", description: "Full motor replacement with quality OEM or aftermarket motor." },
  { id: "solenoid-replacement", name: "Solenoid Replacement", priceRange: "$80–$300", category: "Electrical & Motor", description: "Replace worn solenoid for reliable starting and operation." },
  { id: "fuse-replacement", name: "Fuse Replacement", priceRange: "$10–$140", category: "Electrical & Motor", description: "Replace blown fuses to restore electrical function." },
  { id: "drive-belt-replacement", name: "Drive Belt Replacement", priceRange: "$50–$250", category: "Electrical & Motor", description: "New drive belt for proper power transmission." },
  { id: "clutch-adjustment", name: "Clutch Adjustment", priceRange: "$60–$240", category: "Electrical & Motor", description: "Adjust clutch for smooth engagement and proper operation." },
  { id: "starter-generator-repair", name: "Starter Generator Repair", priceRange: "$120–$400", category: "Electrical & Motor", description: "Repair or rebuild starter generator for reliable starting." },
  { id: "throttle-sensor-calibration", name: "Throttle Sensor Calibration", priceRange: "$75–$300", category: "Electrical & Motor", description: "Calibrate throttle sensor for responsive acceleration." },
  { id: "speed-sensor-replacement", name: "Speed Sensor Replacement", priceRange: "$75–$300", category: "Electrical & Motor", description: "Replace speed sensor for accurate speed reading and control." },
  { id: "solenoid-cleaning", name: "Solenoid Cleaning", priceRange: "$30–$175", category: "Electrical & Motor", description: "Clean and service solenoid for reliable operation." },
  { id: "frame-inspection", name: "Frame Inspection", priceRange: "$50–$220", category: "Inspections & Diagnostics", description: "Thorough inspection of frame integrity and condition." },
  { id: "body-panel-repair", name: "Body Panel Repair", priceRange: "$150–$600", category: "Body & Exterior", description: "Repair dents, cracks, and damage to body panels." },
  { id: "paint-touch-up", name: "Paint Touch-Up", priceRange: "$100–$450", category: "Body & Exterior", description: "Touch up scratches and chips for a fresh appearance." },
  { id: "custom-paint-service", name: "Custom Paint Service", priceRange: "$300–$900", category: "Body & Exterior", description: "Complete custom paint job with your choice of colors and finishes." },
  { id: "upholstery-repair", name: "Upholstery Repair", priceRange: "$100–$500", category: "Body & Exterior", description: "Repair tears, worn areas, and damage to seat upholstery." },
  { id: "seat-replacement", name: "Seat Replacement", priceRange: "$150–$600", category: "Body & Exterior", description: "Replace worn or damaged seats with new upholstery." },
  { id: "weather-enclosure-installation", name: "Weather Enclosure Installation", priceRange: "$100–$400", category: "Accessories & Upgrades", description: "Install protective enclosure for all-weather riding." },
  { id: "headlight-or-taillight-repair", name: "Headlight or Taillight Repair", priceRange: "$50–$300", category: "Body & Exterior", description: "Repair or replace lights for safe visibility." },
  { id: "horn-repair-or-replacement", name: "Horn Repair or Replacement", priceRange: "$20–$160", category: "Body & Exterior", description: "Fix or replace horn for safety signaling." },
  { id: "windshield-installation", name: "Windshield Installation", priceRange: "$80–$300", category: "Accessories & Upgrades", description: "Install new windshield for weather protection and visibility." },
  { id: "side-or-rear-mirror-installation", name: "Side or Rear Mirror Installation", priceRange: "$30–$190", category: "Accessories & Upgrades", description: "Add mirrors for improved safety and visibility." },
  { id: "accessory-installation-per-item", name: "Accessory Installation (Per Item)", priceRange: "$50–$250", category: "Accessories & Upgrades", description: "Professional installation of any golf cart accessory." },
  { id: "custom-wheel-installation", name: "Custom Wheel Installation", priceRange: "$100–$400", category: "Accessories & Upgrades", description: "Install custom wheels for a personalized look." },
  { id: "lift-kit-installation", name: "Lift Kit Installation", priceRange: "$200–$600", category: "Accessories & Upgrades", description: "Lift kit installation for increased ground clearance." },
  { id: "sound-system-installation", name: "Sound System Installation", priceRange: "$100–$400", category: "Accessories & Upgrades", description: "Install speakers and audio system for entertainment on the go." },
  { id: "bluetooth-audio-upgrade", name: "Bluetooth Audio Upgrade", priceRange: "$50–$300", category: "Accessories & Upgrades", description: "Add Bluetooth connectivity for wireless audio streaming." },
  { id: "premium-seat-upgrade", name: "Premium Seat Upgrade", priceRange: "$200–$700", category: "Accessories & Upgrades", description: "Upgrade to premium comfort seats with better cushioning." },
  { id: "led-lighting-upgrade", name: "LED Lighting Upgrade", priceRange: "$50–$350", category: "Accessories & Upgrades", description: "Upgrade to bright, energy-efficient LED lights." },
  { id: "exterior-trim-installation", name: "Exterior Trim Installation", priceRange: "$50–$300", category: "Accessories & Upgrades", description: "Add decorative trim pieces for a custom look." },
  { id: "chrome-accessory-installation", name: "Chrome Accessory Installation", priceRange: "$50–$250", category: "Accessories & Upgrades", description: "Install chrome accents for a polished appearance." },
  { id: "golf-bag-holder-installation", name: "Golf Bag Holder Installation", priceRange: "$30–$180", category: "Accessories & Upgrades", description: "Add secure golf bag storage to your cart." },
  { id: "cup-holder-installation", name: "Cup Holder Installation", priceRange: "$20–$160", category: "Accessories & Upgrades", description: "Install convenient cup holders for beverages." },
  { id: "storage-compartment-installation", name: "Storage Compartment Installation", priceRange: "$40–$220", category: "Accessories & Upgrades", description: "Add extra storage space for gear and belongings." },
  { id: "rear-seat-conversion", name: "Rear Seat Conversion", priceRange: "$150–$500", category: "Accessories & Upgrades", description: "Convert cargo area to additional passenger seating." },
  { id: "charger-plug-or-port-upgrade", name: "Charger Plug or Port Upgrade", priceRange: "$80–$280", category: "Battery Services", description: "Upgrade charging port for faster or more convenient charging." },
  { id: "sound-dampening-installation", name: "Sound Dampening Installation", priceRange: "$50–$250", category: "Accessories & Upgrades", description: "Reduce noise and vibration for a quieter ride." },
  { id: "diagnostic-scan-tool-service", name: "Diagnostic Scan Tool Service", priceRange: "$60–$220", category: "Inspections & Diagnostics", description: "Computer diagnostic scan to identify issues and error codes." },
  { id: "pre-purchase-inspection", name: "Pre-Purchase Inspection", priceRange: "$89–$249", category: "Inspections & Diagnostics", description: "Complete inspection before buying a used golf cart." },
  { id: "street-legal-compliance-inspection", name: "Street-Legal Compliance Inspection", priceRange: "$129–$249", category: "Inspections & Diagnostics", description: "Ensure your cart meets street-legal requirements in your area." },
  { id: "mobile-service-call-fee", name: "Mobile Service Call Fee", priceRange: "$75–$300", category: "Inspections & Diagnostics", description: "We come to you for on-site service and repairs." },
  { id: "pickup-and-delivery-service", name: "Pickup and Delivery Service", priceRange: "$50–$250", category: "Inspections & Diagnostics", description: "We pick up your cart and deliver it back after service." },
  { id: "damage-assessment-inspection", name: "Damage Assessment Inspection", priceRange: "$200–$400", category: "Inspections & Diagnostics", description: "Detailed assessment of accident or damage for repair estimates." },
  { id: "accident-repair-labor", name: "Accident Repair Labor", priceRange: "$100–$500", category: "Body & Exterior", description: "Expert repair work to fix accident damage." },
  { id: "structural-frame-repair", name: "Structural Frame Repair", priceRange: "$200–$700", category: "Body & Exterior", description: "Repair bent or damaged frame for structural integrity." },
  { id: "rust-or-corrosion-treatment", name: "Rust or Corrosion Treatment", priceRange: "$100–$500", category: "Body & Exterior", description: "Treat and prevent rust and corrosion damage." },
  { id: "battery-watering-and-maintenance", name: "Battery Watering and Maintenance", priceRange: "$30–$175", category: "Battery Services", description: "Proper battery watering and maintenance for longevity." },
  { id: "grease-and-lube-service", name: "Grease and Lube Service", priceRange: "$30–$180", category: "Maintenance & Tune-Ups", description: "Lubricate all moving parts for smooth operation." },
  { id: "tire-balancing", name: "Tire Balancing", priceRange: "$20–$150", category: "Tires & Wheels", description: "Balance tires for smooth ride and even wear." },
  { id: "pressure-washing-service", name: "Pressure Washing Service", priceRange: "$40–$220", category: "Cleaning & Detailing", description: "Deep clean your cart with professional pressure washing." },
  { id: "full-detail-service", name: "Full Detail Service", priceRange: "$80–$350", category: "Cleaning & Detailing", description: "Complete interior and exterior detailing for like-new appearance." },
  { id: "seat-and-upholstery-cleaning", name: "Seat and Upholstery Cleaning", priceRange: "$40–$200", category: "Cleaning & Detailing", description: "Deep clean seats and upholstery for fresh appearance." },
  { id: "dashboard-repair", name: "Dashboard Repair", priceRange: "$50–$250", category: "Body & Exterior", description: "Repair cracks, damage, or wear on dashboard components." },
  { id: "horn-replacement", name: "Horn Replacement", priceRange: "$20–$160", category: "Body & Exterior", description: "Install new horn for reliable safety signaling." },
  { id: "fuse-box-inspection", name: "Fuse Box Inspection", priceRange: "$10–$150", category: "Electrical & Motor", description: "Inspect fuse box for issues and replace as needed." },
  { id: "rear-differential-service", name: "Rear Differential Service", priceRange: "$100–$400", category: "Brakes & Suspension", description: "Service rear differential for smooth power delivery." },
  { id: "cv-boot-replacement", name: "CV Boot Replacement", priceRange: "$80–$280", category: "Brakes & Suspension", description: "Replace worn CV boots to protect joints." },
  { id: "axle-replacement", name: "Axle Replacement", priceRange: "$150–$750", category: "Brakes & Suspension", description: "Replace damaged or worn axle for reliable performance." },
  { id: "differential-gear-repair", name: "Differential Gear Repair", priceRange: "$200–$600", category: "Brakes & Suspension", description: "Repair or replace differential gears for proper operation." },
  { id: "brake-fluid-service-gas-carts", name: "Brake Fluid Service (Gas Carts)", priceRange: "$30–$180", category: "Brakes & Suspension", description: "Replace brake fluid for consistent braking performance." },
  { id: "fuel-system-cleaning", name: "Fuel System Cleaning", priceRange: "$60–$250", category: "Maintenance & Tune-Ups", description: "Clean fuel system for better performance and efficiency." },
  { id: "exhaust-system-inspection", name: "Exhaust System Inspection", priceRange: "$40–$220", category: "Inspections & Diagnostics", description: "Inspect exhaust system for leaks and damage." },
  { id: "carburetor-cleaning-or-rebuild", name: "Carburetor Cleaning or Rebuild", priceRange: "$75–$300", category: "Maintenance & Tune-Ups", description: "Clean or rebuild carburetor for optimal fuel delivery." },
  { id: "cooling-fan-or-blower-repair", name: "Cooling Fan or Blower Repair", priceRange: "$40–$220", category: "Electrical & Motor", description: "Repair cooling system for proper temperature management." },
  { id: "heated-seat-installation", name: "Heated Seat Installation", priceRange: "$80–$300", category: "Accessories & Upgrades", description: "Install heated seats for comfortable cold-weather riding." },
  { id: "roof-rack-installation", name: "Roof Rack Installation", priceRange: "$50–$250", category: "Accessories & Upgrades", description: "Add roof rack for extra cargo capacity." },
  { id: "license-plate-bracket-installation", name: "License Plate Bracket Installation", priceRange: "$20–$150", category: "Accessories & Upgrades", description: "Install bracket for street-legal license plate display." },
  { id: "custom-decal-or-wrap-installation", name: "Custom Decal or Wrap Installation", priceRange: "$100–$500", category: "Body & Exterior", description: "Apply custom decals or full wrap for unique styling." },
  { id: "club-holder-installation", name: "Club Holder Installation", priceRange: "$20–$180", category: "Accessories & Upgrades", description: "Install holders for golf clubs or other equipment." },
  { id: "underbody-led-lighting-installation", name: "Underbody LED Lighting Installation", priceRange: "$50–$250", category: "Accessories & Upgrades", description: "Add colorful underbody lighting for custom style." },
  { id: "battery-recycling-and-disposal", name: "Battery Recycling and Disposal", priceRange: "$10–$150", category: "Battery Services", description: "Proper disposal and recycling of old batteries." },
  { id: "warranty-inspection-service", name: "Warranty Inspection Service", priceRange: "$50–$200", category: "Inspections & Diagnostics", description: "Official inspection for warranty claims and documentation." },
  { id: "seasonal-winterization-service", name: "Seasonal Winterization Service", priceRange: "$50–$250", category: "Seasonal Services", description: "Prepare your cart for winter storage with full winterization." },
  { id: "seasonal-de-winterization-service", name: "Seasonal De-Winterization Service", priceRange: "$50–$250", category: "Seasonal Services", description: "Get your cart ready for spring with de-winterization service." }
];

export function getServicesByCategory(category: string): Service[] {
  return services.filter(s => s.category === category);
}

export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

export function getServiceIcon(category: string): string {
  const icons: Record<string, string> = {
    "Maintenance & Tune-Ups": "wrench",
    "Battery Services": "battery",
    "Tires & Wheels": "circle",
    "Brakes & Suspension": "gauge",
    "Electrical & Motor": "zap",
    "Body & Exterior": "paintbrush",
    "Accessories & Upgrades": "sparkles",
    "Inspections & Diagnostics": "search",
    "Cleaning & Detailing": "sparkle",
    "Seasonal Services": "snowflake"
  };
  return icons[category] || "wrench";
}
