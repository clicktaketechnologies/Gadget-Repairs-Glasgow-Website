import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Gamepad2,
  Watch,
  Zap,
  Droplets,
  ShieldCheck,
  Clock,
  Wallet,
  PackageCheck,
  Truck,
  BadgeCheck,
  Wrench,
  Wifi,
  Camera,
  Speaker,
  Volume2,
  Fingerprint,
  Cpu,
  Keyboard,
  HardDrive,
  Fan,
  Disc,
  Gamepad,
  Settings,
  Battery,
  FileCheck,
  HandCoins,
  Search,
  ShoppingBag,
  Gift,
  RefreshCw,
  Plug,
  Unlock,
  type LucideIcon,
} from "lucide-react";

export interface CommonIssue {
  icon: string;
  title: string;
  desc: string;
}
export interface PricingRow {
  device: string;
  repair: string;
  price: string;
}
export interface ProcessStep {
  step: number;
  title: string;
  desc: string;
  icon: string;
}
export interface FaqItem {
  q: string;
  a: string;
}
export interface FeatureHighlight {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceContent {
  slug: string;
  tagline: string;
  intro: string;
  commonIssues: CommonIssue[];
  devices: string[];
  pricingTable: PricingRow[];
  processSteps: ProcessStep[];
  faq: FaqItem[];
  features: FeatureHighlight[];
}

export const ICONS: Record<string, LucideIcon> = {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Gamepad2,
  Watch,
  Zap,
  Droplets,
  ShieldCheck,
  Clock,
  Wallet,
  PackageCheck,
  Truck,
  BadgeCheck,
  Wrench,
  Wifi,
  Camera,
  Speaker,
  Volume2,
  Fingerprint,
  Cpu,
  Keyboard,
  HardDrive,
  Fan,
  Disc,
  Gamepad,
  Settings,
  Battery,
  FileCheck,
  HandCoins,
  Search,
  ShoppingBag,
  Gift,
  RefreshCw,
  Plug,
  Unlock,
};

export function iconFor(name: string): LucideIcon {
  return ICONS[name] ?? Wrench;
}

const MOBILE_REPAIR: ServiceContent = {
  slug: "mobile-repair",
  tagline:
    "Fast mobile phone repair in Glasgow — iPhone, Samsung, Google Pixel and more.",
  intro:
    "From cracked iPhone screens to dead Samsung batteries, our technicians repair every brand of mobile phone — fast. Most repairs are completed the same day with a 30-day warranty on parts and labour. Walk in to our Trongate store or book a free collection across Glasgow.",
  commonIssues: [
    { icon: "Droplets", title: "Cracked Screen", desc: "Smashed front glass, unresponsive touch, dead pixels or LCD bleed." },
    { icon: "Battery", title: "Battery Drain", desc: "Won't hold charge, dies quickly, shuts off at 30%, swelling battery." },
    { icon: "Plug", title: "Charging Port", desc: "Phone won't charge, wobbly cable, slow charging or no power at all." },
    { icon: "Droplets", title: "Water Damage", desc: "Dropped in toilet, rain-soaked or liquid exposure — diagnostics & recovery." },
    { icon: "Camera", title: "Camera Fault", desc: "Blurry photos, black screen, broken lens or flash not working." },
    { icon: "Speaker", title: "Speaker / Mic", desc: "No sound, muffled calls, broken earpiece or ringer not working." },
    { icon: "Unlock", title: "Network Unlock", desc: "Unlock your phone to any UK or international network — fast." },
    { icon: "Settings", title: "Software Issues", desc: "Boot loops, stuck on Apple/Samsung logo, frozen, update failed." },
  ],
  devices: [
    "iPhone 15 Pro Max", "iPhone 14/13/12/11", "iPhone SE",
    "Samsung Galaxy S23/S22/S21", "Samsung Galaxy Note",
    "Google Pixel 8/7/6", "Huawei P/Mate series", "Xiaomi Redmi/Note",
  ],
  pricingTable: [
    { device: "iPhone 15 Pro Max", repair: "Screen replacement", price: "£180" },
    { device: "iPhone 14 / 13", repair: "Screen replacement", price: "£120" },
    { device: "iPhone 11 / 12", repair: "Battery replacement", price: "£45" },
    { device: "Samsung S23 Ultra", repair: "Screen replacement", price: "£220" },
    { device: "Samsung S22 / S21", repair: "Battery replacement", price: "£55" },
    { device: "Google Pixel 7", repair: "Screen + glass", price: "£130" },
    { device: "All phones", repair: "Charging port", price: "from £35" },
    { device: "All phones", repair: "Water damage diagnostics", price: "£25" },
  ],
  processSteps: [
    { step: 1, title: "Free Quote", desc: "Tell us your model and issue — get a fixed price quote in 60 seconds.", icon: "Search" },
    { step: 2, title: "Book or Walk In", desc: "Book online or visit us at 172 Trongate. Free collection available across Glasgow.", icon: "ShoppingBag" },
    { step: 3, title: "Fast Repair", desc: "Most repairs done same day with quality parts and trained technicians.", icon: "Wrench" },
    { step: 4, title: "30-Day Warranty", desc: "Every repair backed by a 30-day warranty on parts and labour.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "How long does a phone screen repair take?", a: "Most screen replacements are completed in 30–90 minutes depending on the model." },
    { q: "Do you use quality parts?", a: "We offer both quality OEM parts and high-quality aftermarket parts — your choice, both with 30-day warranty." },
    { q: "Will I lose my data?", a: "No. Screen and battery repairs don't touch your data. We always recommend backing up first just in case." },
    { q: "Can you unlock my phone to any network?", a: "Yes — we network-unlock iPhones and most Android phones to work on any UK or international SIM." },
    { q: "Do you offer a warranty?", a: "Every repair is covered by a 30-day warranty on parts and labour, excluding accidental or liquid damage." },
  ],
  features: [
    { icon: "Clock", title: "Same-Day Service", desc: "Most repairs done while you wait — typically 30–90 minutes." },
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "Parts and labour fully covered for a full year." },
    { icon: "Wallet", title: "Best Glasgow Prices", desc: "Honest, transparent pricing — no hidden fees, no surprises." },
    { icon: "Truck", title: "Free Collection", desc: "Doorstep collection and delivery across Glasgow, free of charge." },
  ],
};

const MACBOOK_REPAIR: ServiceContent = {
  slug: "macbook-repair",
  tagline:
    "Apple-certified MacBook, MacBook Pro & MacBook Air repair in Glasgow.",
  intro:
    "Our technicians specialise in MacBook repairs — from liquid-damaged logic boards to Retina screen replacements. We use quality Apple parts where available and offer a 30-day warranty on all repairs. Free collection from anywhere in Glasgow.",
  commonIssues: [
    { icon: "Droplets", title: "Liquid Damage", desc: "Spilled tea, coffee or water — we diagnose and recover liquid-damaged logic boards." },
    { icon: "Laptop", title: "Cracked Retina Screen", desc: "Smashed glass, dead pixels, stairstep lines, or no backlight." },
    { icon: "Keyboard", title: "Sticky / Dead Keys", desc: "Butterfly keyboard faults, unresponsive keys, repeated characters." },
    { icon: "Battery", title: "Swollen Battery", desc: "Trackpad popping up, low battery life, 'Service Battery' warning." },
    { icon: "Cpu", title: "Logic Board Fault", desc: "Won't turn on, random shutdowns, kernel panics, no chime." },
    { icon: "Wifi", title: "No Wi-Fi / Bluetooth", desc: "Can't connect, drops randomly, Bluetooth not detected." },
    { icon: "HardDrive", title: "SSD Upgrade", desc: "Out of storage or slow performance — we install larger SSDs." },
    { icon: "Settings", title: "macOS Issues", desc: "Stuck on boot, recovery mode, OS reinstall, password reset." },
  ],
  devices: [
    "MacBook Air M1/M2/M3", "MacBook Pro 13/14/16",
    "MacBook Pro Intel (2016–2020)", "MacBook Air (2018–2020)",
    "MacBook 12-inch", "MacBook Pro Retina", "MacBook Pro with Touch Bar",
  ],
  pricingTable: [
    { device: "MacBook Air M1/M2", repair: "Screen replacement", price: "£320" },
    { device: "MacBook Pro 13\"", repair: "Screen replacement", price: "£350" },
    { device: "MacBook Pro 16\"", repair: "Screen replacement", price: "£450" },
    { device: "MacBook Air/Pro", repair: "Battery replacement", price: "£120–£180" },
    { device: "MacBook Pro 2016–19", repair: "Keyboard replacement", price: "£180–£250" },
    { device: "All MacBooks", repair: "Liquid damage diagnostics", price: "£60" },
    { device: "All MacBooks", repair: "SSD upgrade (256GB→1TB)", price: "from £140" },
    { device: "All MacBooks", repair: "macOS reinstall", price: "£45" },
  ],
  processSteps: [
    { step: 1, title: "Free Diagnostics", desc: "Drop in or book a free collection. We run a full hardware diagnostics on your MacBook.", icon: "Search" },
    { step: 2, title: "Transparent Quote", desc: "You receive a fixed-price quote before any work starts. No surprises.", icon: "Wallet" },
    { step: 3, title: "Expert Repair", desc: "Apple-trained technicians using quality parts where available, completed in 1–3 days.", icon: "Wrench" },
    { step: 4, title: "30-Day Warranty", desc: "All repairs backed by 30-day warranty — collected back to your door for free.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "Can you recover data from a dead MacBook?", a: "Yes. If your logic board is fried we can often recover data by removing the SSD or repairing the board itself." },
    { q: "Are parts quality Apple?", a: "We offer both quality Apple parts and high-quality OEM-equivalent parts. Quality parts cost more but carry the same 30-day warranty." },
    { q: "How long does a MacBook repair take?", a: "Most repairs take 1–3 working days. Logic board repairs can take 3–5 days." },
    { q: "Do I need to back up my data first?", a: "Always recommended. We never intentionally wipe data, but liquid-damaged boards sometimes need an OS reinstall." },
    { q: "Can you fix the butterfly keyboard?", a: "Yes — we replace the full top case assembly including battery on 2016–2019 MacBook Pro models." },
  ],
  features: [
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "Full parts and labour warranty on every MacBook repair." },
    { icon: "Droplets", title: "Liquid Damage Pros", desc: "Component-level logic board repair — we save machines others write off." },
    { icon: "BadgeCheck", title: "Quality Apple Parts", desc: "OEM Apple parts available on request, with full traceability." },
    { icon: "Truck", title: "Free Glasgow Collection", desc: "Doorstep collection and delivery — no need to come to us." },
  ],
};

const LAPTOP_REPAIR: ServiceContent = {
  slug: "laptop-repair",
  tagline:
    "Laptop repair for Dell, HP, Lenovo, ASUS, Acer, Surface and all brands.",
  intro:
    "Whether your laptop won't turn on, runs slowly, or has a shattered screen — we fix every brand. From hardware upgrades to virus removal, we'll have your machine running like new. Walk in or book a free Glasgow collection.",
  commonIssues: [
    { icon: "Laptop", title: "Cracked Screen", desc: "Smashed panel, dead pixels, flickering, no display, lines on screen." },
    { icon: "Battery", title: "Dead Battery", desc: "Won't hold charge, only works plugged in, swelling battery." },
    { icon: "Keyboard", title: "Broken Keys", desc: "Missing keys, unresponsive keyboard, sticky keys, spilled drinks." },
    { icon: "Plug", title: "Charging Port", desc: "Won't charge, loose jack, DC jack broken, no power light." },
    { icon: "Cpu", title: "Overheating", desc: "Fan noise, throttling, random shutdowns, thermal paste dried out." },
    { icon: "HardDrive", title: "Slow Performance", desc: "SSD upgrade, RAM upgrade, fresh OS install, full system clean." },
    { icon: "ShieldCheck", title: "Virus / Malware", desc: "Pop-ups, browser hijack, ransomware, slow boot, suspicious activity." },
    { icon: "Wrench", title: "Hinge / Case", desc: "Broken hinge, cracked chassis, broken trackpad, missing screws." },
  ],
  devices: [
    "Dell XPS / Inspiron / Latitude", "HP Pavilion / Envy / EliteBook",
    "Lenovo ThinkPad / IdeaPad", "ASUS ZenBook / VivoBook",
    "Acer Aspire / Swift", "Microsoft Surface Laptop/Pro",
    "MSI / Razer Blade", "Toshiba / Samsung laptops",
  ],
  pricingTable: [
    { device: "All brands", repair: "Screen replacement", price: "£80–£220" },
    { device: "All brands", repair: "Battery replacement", price: "£60–£140" },
    { device: "All brands", repair: "Keyboard replacement", price: "£50–£120" },
    { device: "All brands", repair: "Charging port / DC jack", price: "£50–£100" },
    { device: "All brands", repair: "SSD upgrade (256GB→1TB)", price: "from £90" },
    { device: "All brands", repair: "RAM upgrade (8GB→16GB)", price: "from £50" },
    { device: "All brands", repair: "Virus / malware removal", price: "£45" },
    { device: "All brands", repair: "Hinge repair", price: "£60–£120" },
  ],
  processSteps: [
    { step: 1, title: "Drop Off / Collection", desc: "Bring your laptop to 172 Trongate or book a free collection anywhere in Glasgow.", icon: "PackageCheck" },
    { step: 2, title: "Full Diagnostics", desc: "We test hardware and software to identify the real cause — not just symptoms.", icon: "Search" },
    { step: 3, title: "Fast Repair", desc: "Most repairs completed in 1–2 days. We text you when it's ready.", icon: "Wrench" },
    { step: 4, title: "Warranty & Return", desc: "30-day warranty on all parts. Free delivery back to your door.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "Can you upgrade my slow laptop instead of buying new?", a: "Often yes. Adding an SSD and more RAM can make a 5-year-old laptop faster than a new budget model — for £100–£150." },
    { q: "Do you recover data from dead laptops?", a: "Yes. If the laptop is dead we can usually recover data from the hard drive to a USB stick or new laptop." },
    { q: "How long does a screen replacement take?", a: "Most laptop screens are replaced fast turnaround or next-day, depending on parts availability." },
    { q: "Do you fix Microsoft Surface devices?", a: "Yes — we replace Surface Laptop and Surface Pro screens, batteries and SSDs." },
    { q: "Is my data safe?", a: "We never wipe data without permission. For OS reinstalls we always attempt a backup first." },
  ],
  features: [
    { icon: "HardDrive", title: "SSD & RAM Upgrades", desc: "Make an old laptop faster than new — fraction of the cost." },
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "All parts and labour covered for a full year." },
    { icon: "Search", title: "Free Diagnostics", desc: "We test before we quote — no charge for telling you what's wrong." },
    { icon: "Truck", title: "Free Collection", desc: "Doorstep pickup and return across Glasgow." },
  ],
};

const GHD_REPAIR: ServiceContent = {
  slug: "ghd-repair",
  tagline:
    "GHD hair straightener repair in Glasgow — Classic, Gold, Platinum, Curve & more.",
  intro:
    "Don't bin your broken GHDs — most faults are fixable in under 2 hours. From dead heating elements to broken cables, our technicians repair every GHD model. With 30-day warranty and fast service on most repairs.",
  commonIssues: [
    { icon: "Zap", title: "Won't Heat Up", desc: "Most common fault — usually a blown thermal fuse or dead heating element." },
    { icon: "Plug", title: "Broken Cable", desc: "Cable torn at the swivel, exposed wires, intermittent power." },
    { icon: "Settings", title: "Flashing Red Light", desc: "Beeping alarm, flashing LED, won't reach temperature." },
    { icon: "Wrench", title: "Cracked Plates", desc: "Chipped ceramic plates, uneven heat, snagging hair." },
    { icon: "Droplets", title: "Thermal Fuse Blown", desc: "GHD cuts out mid-use or won't switch on at all." },
    { icon: "Battery", title: "Won't Switch On", desc: "Dead on/off button, power LED dead, no response." },
    { icon: "Volume2", title: "Beeping Sound", desc: "Continuous beep — overheat protection or faulty sensor." },
    { icon: "Settings", title: "Uneven Heat", desc: "One plate hotter than the other, cold spots." },
  ],
  devices: [
    "GHD Classic Original", "GHD Gold (V1/V2)",
    "GHD Platinum+", "GHD Curve (curler)",
    "GHD Max", "GHD Eclipse",
    "GHD V / IV / V Gold", "GHD Unplugged (cordless)",
  ],
  pricingTable: [
    { device: "All GHD models", repair: "Thermal fuse replacement", price: "£20" },
    { device: "All GHD models", repair: "Power cable replacement", price: "£25" },
    { device: "All GHD models", repair: "Heating element", price: "£35" },
    { device: "GHD Platinum+", repair: "Plate replacement", price: "£45" },
    { device: "GHD Gold", repair: "On/off switch", price: "£25" },
    { device: "GHD Curve", repair: "Barrel element", price: "£40" },
    { device: "All GHD models", repair: "Full service + clean", price: "£30" },
    { device: "All GHD models", repair: "PCB / circuit board", price: "£45–£60" },
  ],
  processSteps: [
    { step: 1, title: "Drop Off", desc: "Bring your GHDs to 172 Trongate — no appointment needed.", icon: "PackageCheck" },
    { step: 2, title: "Free Test", desc: "We diagnose the fault in front of you and quote a fixed price.", icon: "Search" },
    { step: 3, title: "Quick Fix", desc: "Most GHD repairs done in 1–2 hours — same day, while you wait.", icon: "Wrench" },
    { step: 4, title: "Tested & Warrantied", desc: "Tested under load, then covered by our 30-day warranty.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "How long does a GHD repair take?", a: "Most GHD repairs are completed within 1–2 hours — you can wait in store or come back later." },
    { q: "Why won't my GHDs heat up?", a: "Almost always a blown thermal fuse. It's a £20 fix and we stock the parts." },
    { q: "Do you repair GHD Curve curlers?", a: "Yes — we fix GHD Curve, GHD Max, GHD Eclipse and the cordless GHD Unplugged." },
    { q: "Is my model worth repairing?", a: "Almost always yes. A new pair of GHDs costs £100–£179; most repairs are under £45." },
    { q: "Do you offer a warranty?", a: "Yes — all GHD repairs come with a 30-day warranty on parts and labour." },
  ],
  features: [
    { icon: "Clock", title: "Same-Day Repair", desc: "Most GHDs fixed within 1–2 hours, while you wait." },
    { icon: "Wallet", title: "From £20", desc: "Thermal fuse replacement from just £20 — far cheaper than buying new." },
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "All parts and labour fully covered for a year." },
    { icon: "Gift", title: "All Models Serviced", desc: "Classic, Gold, Platinum, Curve, Max, Eclipse — we fix them all." },
  ],
};

const TABLET_REPAIR: ServiceContent = {
  slug: "tablet-repair",
  tagline:
    "iPad and tablet repair in Glasgow — Apple, Samsung, Surface, Lenovo & more.",
  intro:
    "From shattered iPad screens to swollen batteries, our technicians repair every popular tablet — fast. We work on iPads, Samsung Galaxy Tabs, Microsoft Surface, Amazon Fire and Lenovo tablets, all with a 30-day warranty.",
  commonIssues: [
    { icon: "Droplets", title: "Cracked Screen", desc: "Smashed glass, dead touch, unresponsive digitiser, LCD bleed." },
    { icon: "Battery", title: "Battery Issues", desc: "Won't hold charge, dies quickly, swelling battery lifting screen." },
    { icon: "Plug", title: "Charging Port", desc: "Won't charge, wobbly cable, slow charging, debris in port." },
    { icon: "Speaker", title: "No Sound", desc: "Speaker dead, muffled audio, broken headphone jack." },
    { icon: "Camera", title: "Camera Fault", desc: "Blurry photos, black camera, broken lens, flash not working." },
    { icon: "Fingerprint", title: "Home / Touch ID", desc: "Home button not working, Touch ID not recognised after screen change." },
    { icon: "Wifi", title: "No Wi-Fi", desc: "Can't connect, drops randomly, weak signal, no Bluetooth." },
    { icon: "Droplets", title: "Water Damage", desc: "Spills, dropped in water, rain exposure — diagnostics & recovery." },
  ],
  devices: [
    "iPad Pro 11/12.9", "iPad Air (M1/M2)",
    "iPad 10th/9th gen", "iPad mini 6",
    "Samsung Galaxy Tab S9/S8", "Samsung Galaxy Tab A",
    "Microsoft Surface Pro", "Amazon Fire / Lenovo Tab",
  ],
  pricingTable: [
    { device: "iPad Pro 12.9", repair: "Screen replacement", price: "£220" },
    { device: "iPad Air 5", repair: "Screen replacement", price: "£160" },
    { device: "iPad 9th/10th gen", repair: "Screen replacement", price: "£120" },
    { device: "iPad Pro/Air", repair: "Battery replacement", price: "£100–£140" },
    { device: "Samsung Tab S9", repair: "Screen replacement", price: "£200" },
    { device: "Samsung Tab A", repair: "Screen replacement", price: "£80" },
    { device: "Surface Pro", repair: "Screen replacement", price: "£200–£280" },
    { device: "All tablets", repair: "Charging port", price: "from £45" },
  ],
  processSteps: [
    { step: 1, title: "Tell Us Your Model", desc: "Get a fixed-price quote in 60 seconds based on your tablet model.", icon: "Search" },
    { step: 2, title: "Drop In or Book Collection", desc: "Visit 172 Trongate or book a free Glasgow doorstep collection.", icon: "PackageCheck" },
    { step: 3, title: "Repair", desc: "Most tablet repairs done same day or next day.", icon: "Wrench" },
    { step: 4, title: "Warranty & Return", desc: "30-day warranty on all parts. Free return delivery across Glasgow.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "Will you lose my data when fixing the screen?", a: "No. Screen replacements don't affect data. We always recommend a backup just in case." },
    { q: "Can you fix the Touch ID / home button?", a: "Yes — we can pair a new home button to your iPad using Apple's diagnostic tool. Original button is always preferred." },
    { q: "How long does an iPad screen repair take?", a: "Most iPad screen replacements are done same day — typically 1–3 hours." },
    { q: "Do you fix Microsoft Surface tablets?", a: "Yes — we replace Surface Pro screens and batteries. Surface Laptop too." },
    { q: "Are parts quality?", a: "We offer both quality Apple/Samsung parts and high-quality aftermarket options — both with 30-day warranty." },
  ],
  features: [
    { icon: "Clock", title: "Same-Day Service", desc: "Most tablet repairs done in 1–3 hours." },
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "All parts and labour fully covered for a year." },
    { icon: "BadgeCheck", title: "Quality Parts", desc: "OEM Apple and Samsung parts available on request." },
    { icon: "Truck", title: "Free Collection", desc: "Doorstep pickup and return across Glasgow." },
  ],
};

const GAME_CONSOLE_REPAIR: ServiceContent = {
  slug: "game-console-repair",
  tagline:
    "PS5, PS4, Xbox Series X/S, Xbox One & Nintendo Switch repair in Glasgow.",
  intro:
    "No signal on your PS5? Xbox disc drive not reading? Switch joy-con drifting? Our technicians repair every popular game console — fast. We use OEM-quality parts and back every repair with a 30-day warranty.",
  commonIssues: [
    { icon: "Plug", title: "HDMI Port Broken", desc: "No signal, broken pins, loose port, black screen on TV." },
    { icon: "Disc", title: "Disc Drive Fault", desc: "Won't read discs, grinding noise, ejecting games, laser fault." },
    { icon: "Fan", title: "Overheating", desc: "Loud fan, random shutdown, red light, dust-clogged heatsink." },
    { icon: "Gamepad", title: "Controller Drift", desc: "Joy-con drift, analogue stick dead zone, button not registering." },
    { icon: "Battery", title: "Power Supply Fault", desc: "Won't power on, blue light then off, no power light at all." },
    { icon: "Settings", title: "Software Issues", desc: "Stuck on boot, blue screen of death, update failed, safe mode loop." },
    { icon: "Droplets", title: "Liquid Spill", desc: "Spilled drink on console or controller — diagnostics & cleanup." },
    { icon: "Volume2", title: "HDMI No Signal", desc: "Console turns on but TV shows no signal — HDMI chip repair." },
  ],
  devices: [
    "PlayStation 5 (PS5)", "PlayStation 4 / PS4 Pro",
    "Xbox Series X / Series S", "Xbox One / One S / One X",
    "Nintendo Switch OLED", "Nintendo Switch Lite",
    "Nintendo Switch (original)", "PS3 / Xbox 360 (limited)",
  ],
  pricingTable: [
    { device: "PS5", repair: "HDMI port replacement", price: "£90" },
    { device: "PS5", repair: "Disc drive repair", price: "£80–£120" },
    { device: "PS4 Pro", repair: "HDMI port replacement", price: "£60" },
    { device: "Xbox Series X", repair: "HDMI port replacement", price: "£100" },
    { device: "Xbox One", repair: "Disc drive", price: "£70–£100" },
    { device: "Nintendo Switch", repair: "Joy-con drift (pair)", price: "£35" },
    { device: "Nintendo Switch", repair: "Screen replacement", price: "£120" },
    { device: "All consoles", repair: "Overheating service", price: "£45–£80" },
  ],
  processSteps: [
    { step: 1, title: "Bring It In", desc: "Drop your console at 172 Trongate or book a free collection across Glasgow.", icon: "PackageCheck" },
    { step: 2, title: "Free Diagnostics", desc: "We test the console and tell you exactly what's wrong before any work starts.", icon: "Search" },
    { step: 3, title: "Fast Repair", desc: "HDMI ports done same day, more complex repairs take 1–3 days.", icon: "Wrench" },
    { step: 4, title: "Tested & Warrantied", desc: "Tested under load, then covered by our 30-day warranty.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "Can you fix the PS5 HDMI port?", a: "Yes — we replace the HDMI port itself on the motherboard. Done same day in most cases." },
    { q: "How long does a console repair take?", a: "HDMI ports 1–2 days. Disc drives 1–3 days. Software issues often same day." },
    { q: "Do you fix joy-con drift?", a: "Yes — we replace the analogue stick mechanism on both joy-cons for £35 the pair, with 30-day warranty." },
    { q: "Is my game save data safe?", a: "Yes — console hardware repairs don't touch your hard drive or save data." },
    { q: "What's the warranty on console repairs?", a: "All game console repairs carry a 30-day warranty on parts and labour." },
  ],
  features: [
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "All console repairs fully covered for a year." },
    { icon: "Clock", title: "Fast Turnaround", desc: "HDMI ports done same day, most repairs in 1–3 days." },
    { icon: "Gamepad", title: "Controller Drift Fixed", desc: "Joy-con drift repair from £35 a pair — permanently." },
    { icon: "Truck", title: "Free Collection", desc: "Doorstep pickup and return across Glasgow." },
  ],
};

const COMPUTER_REPAIR: ServiceContent = {
  slug: "computer-repair",
  tagline:
    "Desktop PC and iMac repair in Glasgow — upgrades, hardware, software & builds.",
  intro:
    "From custom gaming PCs to aging office towers, our technicians repair and upgrade every kind of desktop computer. RAM and SSD upgrades, virus removal, power supply replacement, custom builds — all backed by 30-day warranty.",
  commonIssues: [
    { icon: "Plug", title: "Power Supply Dead", desc: "Won't turn on, no fan spin, burning smell, random shutdowns." },
    { icon: "HardDrive", title: "Slow Performance", desc: "Boot slow, app launch slow — SSD upgrade makes it fly." },
    { icon: "Fan", title: "Overheating", desc: "Loud fans, thermal throttling, dust-clogged heatsink, dried thermal paste." },
    { icon: "ShieldCheck", title: "Virus / Malware", desc: "Pop-ups, browser hijack, ransomware, suspicious background processes." },
    { icon: "Cpu", title: "GPU Issues", desc: "Artifacts, no display, crashing in games, fans 100% at idle." },
    { icon: "Settings", title: "OS Reinstall", desc: "Windows won't boot, blue screen, fresh install, driver problems." },
    { icon: "Wrench", title: "Hardware Upgrade", desc: "RAM, SSD, GPU, CPU — bring new life to an old PC." },
    { icon: "ShoppingBag", title: "Custom Build", desc: "Design your own gaming or workstation PC — we build & test it." },
  ],
  devices: [
    "Custom-built PCs", "Dell OptiPlex / XPS desktop",
    "HP EliteDesk / Pavilion", "Lenovo ThinkCentre / IdeaCentre",
    "Apple iMac (Intel & M-series)", "Apple Mac mini",
    "ASUS / MSI / Gigabyte builds", "Gaming PCs (RTX / Radeon)",
  ],
  pricingTable: [
    { device: "All PCs", repair: "Diagnostics", price: "Free" },
    { device: "All PCs", repair: "SSD upgrade (256GB→1TB)", price: "from £90" },
    { device: "All PCs", repair: "RAM upgrade (8GB→16GB)", price: "from £50" },
    { device: "All PCs", repair: "Power supply replacement", price: "£70–£140" },
    { device: "All PCs", repair: "Virus / malware removal", price: "£45" },
    { device: "All PCs", repair: "Windows reinstall", price: "£45" },
    { device: "iMac (2017+)", repair: "SSD upgrade", price: "from £180" },
    { device: "Custom build", repair: "Assembly & testing", price: "from £80" },
  ],
  processSteps: [
    { step: 1, title: "Free Diagnostics", desc: "Bring your PC in — we test hardware and tell you what's wrong, free.", icon: "Search" },
    { step: 2, title: "Fixed Quote", desc: "You get a transparent fixed-price quote before any work starts.", icon: "Wallet" },
    { step: 3, title: "Repair / Upgrade", desc: "We use quality components and complete most repairs in 1–3 days.", icon: "Wrench" },
    { step: 4, title: "Tested & Warrantied", desc: "Stress-tested and covered by our 30-day warranty.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "Can you build a custom gaming PC?", a: "Yes — bring your parts list (or we'll spec one for you) and we'll build, cable-manage and stress-test it for from £80." },
    { q: "Can you speed up my old PC?", a: "Usually yes. SSD upgrade + RAM upgrade typically costs £100–£150 and transforms a 5-year-old PC." },
    { q: "Do you repair iMacs?", a: "Yes — we upgrade iMac SSDs and RAM, replace screens, and fix logic board faults on Intel and M-series iMacs." },
    { q: "Will you wipe my data?", a: "Never without permission. For OS reinstalls we attempt a full backup first." },
    { q: "Do you fix business PCs?", a: "Yes — we offer priority business repairs and on-site visits for Glasgow businesses." },
  ],
  features: [
    { icon: "HardDrive", title: "SSD & RAM Upgrades", desc: "Make an old PC faster than new — for £100–£150." },
    { icon: "ShoppingBag", title: "Custom Builds", desc: "Design and build your dream gaming or workstation PC." },
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "All parts and labour covered for a full year." },
    { icon: "Search", title: "Free Diagnostics", desc: "We test before we quote — no charge for telling you what's wrong." },
  ],
};

const SMART_WATCH_REPAIR: ServiceContent = {
  slug: "smart-watch-repair",
  tagline:
    "Apple Watch, Samsung Galaxy Watch, Fitbit & Garmin repair in Glasgow.",
  intro:
    "Cracked your Apple Watch screen? Battery dying on your Fitbit? Our technicians repair every popular smart watch — fast. We replace screens, batteries, buttons and straps, all with a 30-day warranty.",
  commonIssues: [
    { icon: "Droplets", title: "Cracked Glass", desc: "Smashed screen, dead touch, broken OLED, chips on edge." },
    { icon: "Battery", title: "Battery Drain", desc: "Won't last the day, dies quickly, swollen battery." },
    { icon: "Droplets", title: "Water Damage", desc: "Foggy screen, won't charge, water ingress despite rating." },
    { icon: "Settings", title: "Button / Crown Fault", desc: "Digital crown not scrolling, side button stuck, broken bezel." },
    { icon: "Wifi", title: "No Bluetooth / Wi-Fi", desc: "Won't pair with phone, drops randomly, weak signal." },
    { icon: "Speaker", title: "No Sound / Mic", desc: "Can't take calls, no haptic, broken speaker, mic dead." },
    { icon: "Wrench", title: "Strap Broken", desc: "Strap lug broken, band won't attach, torn sport band." },
    { icon: "Settings", title: "Software Issues", desc: "Stuck on Apple logo, won't update, unpair failed." },
  ],
  devices: [
    "Apple Watch Series 9/8/7", "Apple Watch SE (2nd gen)",
    "Apple Watch Series 6/5/4", "Samsung Galaxy Watch 6/5/4",
    "Samsung Galaxy Watch Active", "Fitbit Versa / Sense",
    "Fitbit Charge / Inspire", "Garmin Fenix / Forerunner",
  ],
  pricingTable: [
    { device: "Apple Watch Series 9", repair: "Screen replacement", price: "£180" },
    { device: "Apple Watch Series 8/7", repair: "Screen replacement", price: "£150" },
    { device: "Apple Watch SE", repair: "Screen replacement", price: "£100" },
    { device: "Apple Watch", repair: "Battery replacement", price: "£60–£90" },
    { device: "Samsung Galaxy Watch 6", repair: "Screen replacement", price: "£130" },
    { device: "Fitbit Versa / Sense", repair: "Screen + battery", price: "£70" },
    { device: "All smart watches", repair: "Strap replacement", price: "from £15" },
    { device: "All smart watches", repair: "Water damage diagnostics", price: "£25" },
  ],
  processSteps: [
    { step: 1, title: "Tell Us Your Model", desc: "Get a fixed-price quote based on your smart watch model.", icon: "Search" },
    { step: 2, title: "Drop In / Collection", desc: "Visit 172 Trongate or book a free Glasgow collection.", icon: "PackageCheck" },
    { step: 3, title: "Fast Repair", desc: "Most smart watch repairs done same day or next day.", icon: "Wrench" },
    { step: 4, title: "Warranty & Return", desc: "30-day warranty on all parts. Free return delivery.", icon: "ShieldCheck" },
  ],
  faq: [
    { q: "Can you replace the screen on an Apple Watch?", a: "Yes — we replace Apple Watch screens on every series from Series 3 to Series 9, all with 30-day warranty." },
    { q: "Will replacing the screen break waterproofing?", a: "We reseal the watch with adhesive and pressure-test the seal. Water resistance is restored to original spec." },
    { q: "How long does a smart watch repair take?", a: "Most repairs done same day — typically 1–2 hours for screen or battery." },
    { q: "Do you fix Fitbit and Garmin too?", a: "Yes — we replace screens and batteries on Fitbit Versa, Sense, Charge, Inspire and most Garmin models." },
    { q: "Do you replace straps?", a: "Yes — we stock common straps and can fit a new one for from £15 including the strap." },
  ],
  features: [
    { icon: "Clock", title: "Same-Day Service", desc: "Most smart watch repairs done within 1–2 hours." },
    { icon: "ShieldCheck", title: "30-Day Warranty", desc: "All parts and labour fully covered for a year." },
    { icon: "Droplets", title: "Waterproof Reseal", desc: "Pressure-tested seal after every screen replacement." },
    { icon: "Watch", title: "All Brands", desc: "Apple, Samsung, Fitbit, Garmin — we fix them all." },
  ],
};

const CONTENT_MAP: Record<string, ServiceContent> = {
  "mobile-repair": MOBILE_REPAIR,
  "macbook-repair": MACBOOK_REPAIR,
  "laptop-repair": LAPTOP_REPAIR,
  "ghd-repair": GHD_REPAIR,
  "tablet-repair": TABLET_REPAIR,
  "game-console-repair": GAME_CONSOLE_REPAIR,
  "computer-repair": COMPUTER_REPAIR,
  "smart-watch-repair": SMART_WATCH_REPAIR,
};

export function getServiceContent(slug: string): ServiceContent {
  return (
    CONTENT_MAP[slug] ?? {
      ...MOBILE_REPAIR,
      slug,
      tagline: "Professional repair service.",
      intro: "We offer professional repair with 30-day warranty.",
    }
  );
}
