export interface StaticService {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  priceFrom: string | null;
  priceTo: string | null;
  turnaround: string | null;
  popular: boolean;
  active: boolean;
  sortOrder: number;
}
export const STATIC_SERVICES: StaticService[] = [
  {
    id: "s1",
    slug: "mobile-repair",
    name: "Mobile Repair Service",
    category: "Mobile Repair",
    description:
      "Professional repair for all smartphones — cracked screens, battery replacement, charging port fixes, water damage recovery, and software issues. iPhone, Samsung, Google Pixel, Huawei, Xiaomi and all major brands. Same-day service with 12-month warranty.",
    icon: "Smartphone",
    priceFrom: "£25",
    priceTo: "£250",
    turnaround: "30 min – 2 hours",
    popular: true,
    active: true,
    sortOrder: 1,
  },
  {
    id: "s2",
    slug: "macbook-repair",
    name: "MacBook Repair Service",
    category: "MacBook Repair",
    description:
      "Expert MacBook, MacBook Pro and MacBook Air repair — screen replacement, battery, keyboard, trackpad, logic board diagnostics, and liquid damage recovery. Genuine Apple parts available with 12-month warranty.",
    icon: "Laptop",
    priceFrom: "£60",
    priceTo: "£450",
    turnaround: "1 – 3 days",
    popular: true,
    active: true,
    sortOrder: 2,
  },
  {
    id: "s3",
    slug: "laptop-repair",
    name: "Laptop Repair Service",
    category: "Laptop Repair",
    description:
      "Comprehensive laptop repair for all brands — Dell, HP, Lenovo, ASUS, Acer, Microsoft Surface and more. Screen replacement, keyboard, battery, charging port, hinge repair, data recovery, and virus removal.",
    icon: "Laptop",
    priceFrom: "£40",
    priceTo: "£300",
    turnaround: "1 – 2 days",
    popular: true,
    active: true,
    sortOrder: 3,
  },
  {
    id: "s4",
    slug: "ghd-repair",
    name: "GHD Repair Service",
    category: "GHD Repair",
    description:
      "Professional GHD hair straightener repair — won't heat, broken cable, flashing light, plate replacement, and thermal fuse issues. All GHD models serviced including Classic, Gold, Platinum, and Curve.",
    icon: "Zap",
    priceFrom: "£20",
    priceTo: "£60",
    turnaround: "1 – 2 hours",
    popular: false,
    active: true,
    sortOrder: 4,
  },
  {
    id: "s5",
    slug: "tablet-repair",
    name: "Tablet Repair Service",
    category: "Tablet Repair",
    description:
      "Tablet and iPad repair — screen replacement, battery, charging port, speaker, button and camera fixes. Apple iPad, Samsung Galaxy Tab, Microsoft Surface, Amazon Fire, Lenovo Tab and more.",
    icon: "Tablet",
    priceFrom: "£40",
    priceTo: "£220",
    turnaround: "1 – 3 hours",
    popular: true,
    active: true,
    sortOrder: 5,
  },
  {
    id: "s6",
    slug: "game-console-repair",
    name: "Game Console Repair Service",
    category: "Game Console Repair",
    description:
      "Game console repair for PlayStation, Xbox, Nintendo Switch and more. HDMI port replacement, disc drive repair, overheating/fan issues, controller drift, power supply, and software problems.",
    icon: "Gamepad2",
    priceFrom: "£35",
    priceTo: "£200",
    turnaround: "1 – 3 days",
    popular: false,
    active: true,
    sortOrder: 6,
  },
  {
    id: "s7",
    slug: "computer-repair",
    name: "Computer Repair Service",
    category: "Computer Repair",
    description:
      "Desktop PC and iMac repair — hardware upgrades, RAM/SSD installation, virus removal, OS reinstall, power supply replacement, GPU issues, and custom builds.",
    icon: "Monitor",
    priceFrom: "£35",
    priceTo: "£350",
    turnaround: "1 – 3 days",
    popular: false,
    active: true,
    sortOrder: 7,
  },
  {
    id: "s8",
    slug: "smart-watch-repair",
    name: "Smart Watch Repair Service",
    category: "Smart Watch Repair",
    description:
      "Smart watch repair for Apple Watch, Samsung Galaxy Watch, Fitbit, Garmin and more. Screen/glass replacement, battery, water damage, button/crown repair, and strap replacement.",
    icon: "Watch",
    priceFrom: "£30",
    priceTo: "£180",
    turnaround: "1 – 2 hours",
    popular: false,
    active: true,
    sortOrder: 8,
  },
];
export const STATIC_BRANDING = {
  id: "singleton",
  businessName: "Gadget Repairs Glasgow",
  tagline:
    "Professional Mobile Phone & Tablet Repair, Unlocking, and Accessories",
  about:
    "Gadget Repairs Glasgow is a trusted repair shop at 172 Trongate in Glasgow city centre. For over 10 years we have been fixing mobile phones, MacBooks, laptops, tablets, game consoles, computers, smart watches and GHD straighteners for thousands of happy customers.",
  logoUrl: "/logo.jpg",
  faviconUrl: "/logo.jpg",
  primaryColor: "#1b4f8e",
  secondaryColor: "#f05a28",
  phone: "+44 7777 200149",
  whatsapp: "+44 7777 200149",
  email: "info@gadgetrepairsglasgow.co.uk",
  website: "https://www.gadgetrepairsglasgow.co.uk",
  gmbProfile: "https://g.co/kgs/DKcPKfJ",
  mapLink: "https://maps.google.com/?q=172+Trongate+Glasgow+UK",
  mapEmbed:
    "https://www.google.com/maps?q=172+Trongate+Glasgow+UK&output=embed",
  address: "172 Trongate, Glasgow, UK",
  hoursJson: JSON.stringify([
    { day: "Monday", hours: "9:00 AM – 7:00 PM" },
    { day: "Tuesday", hours: "9:00 AM – 7:00 PM" },
    { day: "Wednesday", hours: "9:00 AM – 7:00 PM" },
    { day: "Thursday", hours: "9:00 AM – 7:00 PM" },
    { day: "Friday", hours: "9:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 7:00 PM" },
    { day: "Sunday", hours: "10:30 AM – 5:30 PM" },
  ]),
  socialsJson: JSON.stringify([
    { name: "Facebook", url: "https://www.facebook.com/gadgetrepairglasgow" },
    {
      name: "Instagram",
      url: "https://www.instagram.com/gadgetrepairsglasgow/",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@gadgetrepairsglasgow",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@Gadgetrepairsglassgow",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/gadgetrepairsglasgow/",
    },
  ]),
  targetAreasJson: JSON.stringify([
    "Trongate",
    "Glasgow City Centre",
    "Merchant City",
    "Buchanan Street",
    "Dennistoun",
    "Gorbals",
  ]),
  rating: 4.9,
  reviewCount: 150,
  yearsExperience: 10,
};
export const STATIC_SETTINGS = {
  id: "singleton",
  collectionEnabled: true,
  collectionBannerEnabled: true,
  announcementEnabled: true,
  announcementText:
    "🎉 Free doorstep collection across Glasgow — book online today!",
  ticketIdVisible: true,
  customHeaderCode: "",
  customFooterCode: "",
};
export const STATIC_REVIEWS = [
  {
    id: "r1",
    author: "Mark Thompson",
    rating: 5,
    comment:
      "Cracked iPhone 14 Pro screen replaced in 40 minutes. Looks brand new and works perfectly. Best price in Glasgow by far!",
    device: "iPhone 14 Pro",
    source: "Google",
    approved: true,
    createdAt: "2025-10-15T10:00:00Z",
  },
  {
    id: "r2",
    author: "Sarah McLean",
    rating: 5,
    comment:
      "My Samsung battery was dying by lunchtime. Gadget Repairs swapped it the same day and now it lasts two days. Friendly staff and honest advice.",
    device: "Samsung Galaxy S22",
    source: "Google",
    approved: true,
    createdAt: "2025-10-12T14:30:00Z",
  },
  {
    id: "r3",
    author: "David Wilson",
    rating: 5,
    comment:
      "MacBook Pro keyboard was failing. These guys replaced it for half what Apple quoted. Genuine part, 12-month warranty.",
    device: "MacBook Pro 2019",
    source: "Google",
    approved: true,
    createdAt: "2025-10-10T09:15:00Z",
  },
  {
    id: "r4",
    author: "Aisha Rahman",
    rating: 5,
    comment:
      "My GHD straighteners stopped heating. Thought I'd need new ones but they fixed the thermal fuse in an hour for £25. Brilliant service!",
    device: "GHD Platinum+",
    source: "Walk-in",
    approved: true,
    createdAt: "2025-10-08T16:45:00Z",
  },
  {
    id: "r5",
    author: "James O'Brien",
    rating: 4,
    comment:
      "PS5 HDMI port was broken. Repair took 2 days but works perfectly now. Fair price and they kept me informed throughout.",
    device: "PlayStation 5",
    source: "Google",
    approved: true,
    createdAt: "2025-10-05T11:20:00Z",
  },
  {
    id: "r6",
    author: "Katie Donaldson",
    rating: 5,
    comment:
      "iPad screen shattered. Fixed it for half what Apple quoted and collected from my office for free. Honest business.",
    device: "iPad Air 5",
    source: "Google",
    approved: true,
    createdAt: "2025-10-03T13:00:00Z",
  },
  {
    id: "r7",
    author: "Steven Reid",
    rating: 5,
    comment:
      "Apple Watch screen cracked. Replaced same day, waterproofing tested. Reasonable price and friendly service.",
    device: "Apple Watch Series 8",
    source: "Instagram",
    approved: true,
    createdAt: "2025-10-01T15:30:00Z",
  },
  {
    id: "r8",
    author: "Lisa Cameron",
    rating: 5,
    comment:
      "Laptop was running slow and full of viruses. Cleaned it up, installed SSD, now flies. Way cheaper than buying new.",
    device: "Dell XPS 13",
    source: "Walk-in",
    approved: true,
    createdAt: "2025-09-28T10:00:00Z",
  },
];
export const STATIC_POSTS = [
  {
    id: "p1",
    slug: "cracked-iphone-screen-glasgow-guide",
    title:
      "Cracked iPhone Screen in Glasgow? Here's Your Complete Repair Guide",
    excerpt:
      "Everything you need to know about getting your iPhone screen fixed in Glasgow.",
    content:
      "# Cracked iPhone Screen in Glasgow?\n\nA cracked iPhone screen is one of the most common accidents. The good news is you have excellent local repair options.\n\n## Cost\n- iPhone 11/12/13: £80–£140\n- iPhone 14/15: £120–£180\n\n## Turnaround\nMost screen replacements are completed in 30–90 minutes.",
    coverImage:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    category: "Mobile Repair",
    tags: "iPhone,screen repair",
    author: "Gadget Repairs Glasgow",
    published: true,
    featured: true,
    createdAt: "2025-10-20T10:00:00Z",
    updatedAt: "2025-10-20T10:00:00Z",
  },
  {
    id: "p2",
    slug: "macbook-repair-glasgow-guide",
    title:
      "MacBook Repair in Glasgow: Costs, Common Issues & What to Expect",
    excerpt:
      "MacBook not turning on? Keyboard failing? Screen damaged? Here's everything Glasgow MacBook owners need to know.",
    content:
      "# MacBook Repair in Glasgow\n\n## Common Issues\n- Keyboard failure\n- Screen damage\n- Battery swelling\n- Liquid damage\n\n## Costs\n- Battery: £80–£150\n- Keyboard: £120–£250\n- Screen: £200–£450",
    coverImage:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    category: "MacBook Repair",
    tags: "MacBook,repair",
    author: "Gadget Repairs Glasgow",
    published: true,
    featured: false,
    createdAt: "2025-10-19T10:00:00Z",
    updatedAt: "2025-10-19T10:00:00Z",
  },
  {
    id: "p3",
    slug: "ghd-straightener-repair-guide",
    title: "GHD Won't Heat? Common Faults & How Much GHD Repair Costs",
    excerpt:
      "GHD straighteners stopped working? Here's what's wrong and how much it costs to fix.",
    content:
      "# GHD Repair Guide\n\n## Common Faults\n- Won't heat up (thermal fuse)\n- Flashing red light\n- Broken cable\n\n## Cost: £20–£60",
    coverImage:
      "https://images.unsplash.com/photo-1522335789203-aaa9cbb96e9d?w=800&q=80",
    category: "GHD Repair",
    tags: "GHD,straightener",
    author: "Gadget Repairs Glasgow",
    published: true,
    featured: false,
    createdAt: "2025-10-18T10:00:00Z",
    updatedAt: "2025-10-18T10:00:00Z",
  },
  {
    id: "p4",
    slug: "ps5-xbox-hdmi-port-repair",
    title:
      "PS5/Xbox HDMI Port Broken? Console Repair Guide for Glasgow Gamers",
    excerpt:
      "No signal on your PS5 or Xbox? HDMI port damaged? Here's how much console repair costs.",
    content:
      "# Game Console HDMI Repair\n\n## Common Issues\n- HDMI port damage\n- Disc drive not reading\n- Overheating\n- Controller drift\n\n## Cost: £35–£200",
    coverImage:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    category: "Game Console Repair",
    tags: "PS5,Xbox,HDMI",
    author: "Gadget Repairs Glasgow",
    published: true,
    featured: false,
    createdAt: "2025-10-17T10:00:00Z",
    updatedAt: "2025-10-17T10:00:00Z",
  },
];
