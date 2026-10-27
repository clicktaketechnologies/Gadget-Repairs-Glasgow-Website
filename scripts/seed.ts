import { db } from "../src/lib/db";

async function main() {
  console.log("🌱 Seeding database...");

  // ---------- Branding ----------
  const branding = {
    id: "singleton",
    businessName: "Gadget Repairs Glasgow",
    tagline: "Professional Mobile Phone & Tablet Repair, Unlocking, and Accessories",
    about:
      "Gadget Repairs Glasgow is a trusted, locally-run repair shop on Trongate in the heart of Glasgow city centre. For over 10 years we have been fixing cracked screens, dead batteries, faulty charging ports, software issues and liquid damage for thousands of happy customers across the city. Our certified technicians use premium parts and offer a no-fix, no-fee guarantee on most repairs. Walk in, book online, or use our free doorstep collection service — most repairs are completed the same day.",
    logoUrl: "/logo.svg",
    faviconUrl: "/logo.svg",
    primaryColor: "#0f766e",
    secondaryColor: "#f59e0b",
    phone: "+44 7777 200149",
    whatsapp: "+44 7777 200149",
    email: "info@gadgetrepairsglasgow.co.uk",
    website: "https://www.gadgetrepairsglasgow.co.uk",
    gmbProfile: "https://g.co/kgs/DKcPKfJ",
    mapLink: "https://maps.google.com/?q=172+Trongate+Glasgow+UK",
    mapEmbed: "https://www.google.com/maps?q=172+Trongate+Glasgow+UK&output=embed",
    address: "172 Trongate, Glasgow, UK",
    hoursJson: JSON.stringify([
      { day: "Monday", hours: "10:00 AM – 7:00 PM" },
      { day: "Tuesday", hours: "10:00 AM – 7:00 PM" },
      { day: "Wednesday", hours: "10:00 AM – 7:00 PM" },
      { day: "Thursday", hours: "10:00 AM – 7:00 PM" },
      { day: "Friday", hours: "10:00 AM – 7:00 PM" },
      { day: "Saturday", hours: "10:00 AM – 7:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 5:00 PM" },
    ]),
    socialsJson: JSON.stringify([
      { name: "Facebook", url: "https://www.facebook.com/gadgetrepairglasgow" },
      { name: "Instagram", url: "https://www.instagram.com/gadgetrepairsglasgow/" },
      { name: "TikTok", url: "https://www.tiktok.com/@gadgetrepairsglasgow" },
      { name: "Pinterest", url: "https://uk.pinterest.com/gadgetrepairsglassgow/" },
      { name: "YouTube", url: "https://www.youtube.com/@Gadgetrepairsglassgow" },
      { name: "LinkedIn", url: "https://www.linkedin.com/company/gadgetrepairsglasgow/" },
      { name: "Blog", url: "https://gadgetrepairglasgow.blogspot.com/" },
    ]),
    targetAreasJson: JSON.stringify([
      "Trongate", "Possilpark", "Sighthill", "Hutchesontown", "Dennistoun",
      "Royston", "Haghill", "Riddrie", "Cranhill", "Easterhouse",
      "Barmulloch", "Balornock", "Mile-end", "Laurieston", "Cessnock",
    ]),
    rating: 4.9,
    reviewCount: 150,
    yearsExperience: 10,
  };
  await db.branding.upsert({ where: { id: "singleton" }, update: branding, create: branding });

  // ---------- SiteSettings ----------
  const settings = {
    id: "singleton",
    collectionEnabled: true,
    collectionBannerEnabled: true,
    announcementEnabled: true,
    announcementText: "🎉 Free doorstep collection across Glasgow — book online today!",
    ticketIdVisible: true,
    customHeaderCode: "",
    customFooterCode: "",
  };
  await db.siteSettings.upsert({ where: { id: "singleton" }, update: settings, create: settings });

  // ---------- EmailSettings ----------
  const email = {
    id: "singleton",
    enabled: false,
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "",
    password: "",
    fromEmail: "info@gadgetrepairsglasgow.co.uk",
    fromName: "Gadget Repairs Glasgow",
  };
  await db.emailSettings.upsert({ where: { id: "singleton" }, update: email, create: email });

  // ---------- AdminUser ----------
  const existingAdmin = await db.adminUser.findFirst({ where: { email: "admin@gadgetrepairsglasgow.co.uk" } });
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        email: "admin@gadgetrepairsglasgow.co.uk",
        name: "Store Admin",
        password: "securepassword123",
      },
    });
  }

  // ---------- Services ----------
  const services = [
    { slug: "phone-repairs", name: "Phone Repairs & Diagnostics", category: "Mobile Phone Repair", description: "Professional hardware and software troubleshooting, charging port repairs, camera fixes, water-damage recovery, and more for all major smartphone brands. Most diagnostics completed in under 30 minutes.", icon: "Smartphone", priceFrom: "£25", priceTo: "£180", turnaround: "30 min – 2 hours", popular: true, sortOrder: 1 },
    { slug: "network-unlocking", name: "Network Unlocking Services", category: "Phone & Tablet Unlocking", description: "Safe, permanent factory unlocking services so you can use your phone or tablet on any network provider worldwide. 100% legal and fully guaranteed.", icon: "Unlock", priceFrom: "£15", priceTo: "£45", turnaround: "1 – 24 hours", popular: true, sortOrder: 2 },
    { slug: "tablet-ipad-repair", name: "Tablet & iPad Solutions", category: "Tablet & iPad Repair", description: "Comprehensive repair services to get your tablets and iPads working like new — screen replacement, battery, charging port, speaker and button repairs.", icon: "Tablet", priceFrom: "£40", priceTo: "£220", turnaround: "1 – 3 hours", popular: true, sortOrder: 3 },
    { slug: "screen-replacement", name: "Display & Glass Replacement", category: "Screen Replacement", description: "Expert replacement of cracked, scratched, or unresponsive touch screens and LCD/OLED panels using premium-grade parts with a 12-month warranty.", icon: "MonitorSmartphone", priceFrom: "£45", priceTo: "£250", turnaround: "30 – 90 min", popular: true, sortOrder: 4 },
    { slug: "battery-replacement", name: "Battery Health Solutions", category: "Battery Replacement", description: "Quick replacement of degraded or swelling batteries to give your device full-day power again. Genuine and OEM-equivalent batteries available.", icon: "BatteryCharging", priceFrom: "£30", priceTo: "£90", turnaround: "30 – 60 min", popular: true, sortOrder: 5 },
    { slug: "buy-sell-phones", name: "Device Trade-In & Sales", category: "Buy & Sell New Phones", description: "Buy certified pre-owned phones with warranty, or sell your current devices at competitive rates. Instant quotes and same-day payment.", icon: "Repeat", priceFrom: "£50", priceTo: "£800", turnaround: "Same day", popular: false, sortOrder: 6 },
    { slug: "mobile-accessories", name: "Protective Cases & Chargers", category: "Mobile Accessories", description: "Wide selection of durable cases, tempered-glass screen protectors, fast chargers, cables, power banks and audio accessories for all major brands.", icon: "Plug", priceFrom: "£5", priceTo: "£60", turnaround: "Walk in & buy", popular: false, sortOrder: 7 },
    { slug: "water-damage", name: "Water Damage Recovery", category: "Mobile Phone Repair", description: "Specialist ultrasonic cleaning and component-level diagnostics for liquid-damaged phones and tablets. We salvage devices others would write off.", icon: "Droplets", priceFrom: "£40", priceTo: "£150", turnaround: "24 – 72 hours", popular: false, sortOrder: 8 },
  ];
  for (const s of services) {
    const existing = await db.service.findUnique({ where: { slug: s.slug } });
    if (existing) await db.service.update({ where: { slug: s.slug }, data: s });
    else await db.service.create({ data: s });
  }

  // ---------- Reviews ----------
  const reviews = [
    { author: "Mark Thompson", rating: 5, comment: "Cracked iPhone 14 Pro screen replaced in 40 minutes. Looks brand new and works perfectly. Best price in Glasgow by far!", device: "iPhone 14 Pro", source: "Google", approved: true },
    { author: "Sarah McLean", rating: 5, comment: "My Samsung battery was dying by lunchtime. Gadget Repairs swapped it the same day and now it lasts two days. Friendly staff and honest advice.", device: "Samsung Galaxy S22", source: "Google", approved: true },
    { author: "David Wilson", rating: 5, comment: "Unlocked my old Huawei so I could give it to my daughter on a cheaper network. Done in an hour, permanent and fully legal. Highly recommend.", device: "Huawei P30", source: "Facebook", approved: true },
    { author: "Aisha Rahman", rating: 5, comment: "Dropped my iPad and shattered the screen. These guys fixed it for half what Apple quoted. Collected from my office and dropped it back free of charge!", device: "iPad Air", source: "Google", approved: true },
    { author: "James O'Brien", rating: 4, comment: "Good service, charging port fixed on my Pixel. Took a little longer than quoted but they kept me informed. Would use again.", device: "Google Pixel 7", source: "Walk-in", approved: true },
    { author: "Katie Donaldson", rating: 5, comment: "Bought a refurbished iPhone 13 here. Fair price, genuine battery health and 12-month warranty. Honest business — won't find better in Glasgow.", device: "iPhone 13", source: "Google", approved: true },
    { author: "Steven Reid", rating: 5, comment: "Phone survived a dip in the Clyde thanks to these magicians. Thought it was a goner. Reasonable price and friendly service.", device: "iPhone 12", source: "Instagram", approved: true },
    { author: "Lisa Cameron", rating: 5, comment: "Bought a fast charger and tempered glass — way cheaper than Curry's and they fitted it for free. My go-to gadget shop in town.", device: "Samsung Galaxy S23", source: "Walk-in", approved: true },
  ];
  const reviewCount = await db.review.count();
  if (reviewCount < reviews.length) {
    for (const r of reviews) {
      const exists = await db.review.findFirst({ where: { author: r.author, comment: r.comment } });
      if (!exists) await db.review.create({ data: r });
    }
  }

  // ---------- Bookings ----------
  const statuses = ["Pending", "In Progress", "Ready", "Completed", "Completed", "Completed"];
  const devices = [
    { type: "Phone", model: "iPhone 14 Pro", issue: "Cracked screen" },
    { type: "Phone", model: "Samsung Galaxy S22", issue: "Battery replacement" },
    { type: "Tablet", model: "iPad Air 5th Gen", issue: "Screen replacement" },
    { type: "Phone", model: "Google Pixel 7", issue: "Charging port not working" },
    { type: "Phone", model: "iPhone 13", issue: "Water damage" },
    { type: "Phone", model: "Huawei P30", issue: "Network unlock" },
    { type: "Tablet", model: "Samsung Galaxy Tab S8", issue: "Broken LCD" },
    { type: "Phone", model: "iPhone 12", issue: "Battery swelling" },
    { type: "Phone", model: "Xiaomi Redmi Note 12", issue: "Speaker not working" },
    { type: "Phone", model: "iPhone SE 2022", issue: "Front camera faulty" },
  ];
  const bookingCount = await db.booking.count();
  if (bookingCount === 0) {
    for (let i = 0; i < devices.length; i++) {
      const d = devices[i];
      const daysAgo = i;
      const date = new Date(Date.now() - daysAgo * 86400000);
      const ticketNum = String(1024 + i).padStart(4, "0");
      await db.booking.create({
        data: {
          ticketId: `GD-${ticketNum}`,
          customerName: ["John Smith", "Emma Jones", "Michael Brown", "Olivia Taylor", "William Davis", "Sophia Wilson", "Lucas Miller", "Mia Anderson", "Ethan Moore", "Isabella Lee"][i],
          email: `customer${i + 1}@example.com`,
          phone: `+44 7700 900${100 + i}`,
          deviceType: d.type,
          deviceModel: d.model,
          issue: d.issue,
          needsCollection: i % 3 === 0,
          collectionAddr: i % 3 === 0 ? `${i + 1} Buchanan St, Glasgow` : null,
          status: statuses[i % statuses.length],
          technicianNotes: i % 2 === 0 ? "Diagnosed: part ordered, replacement scheduled." : "Repair completed and QA tested.",
          quotedPrice: `£${50 + i * 15}`,
          finalPrice: i >= 4 ? `£${50 + i * 15}` : null,
          source: i % 2 === 0 ? "online" : "walk-in",
          bookingDate: date.toISOString().split("T")[0],
          bookingTime: "10:30",
          createdAt: date,
        },
      });
    }
  }

  // ---------- Blog Posts ----------
  const posts = [
    {
      slug: "cracked-iphone-screen-glasgow-guide",
      title: "Cracked iPhone Screen in Glasgow? Here's Your Complete Repair Guide",
      excerpt: "Everything you need to know about getting your iPhone screen fixed in Glasgow — costs, turnaround times, warranty, and how to avoid dodgy shops.",
      content: `# Cracked iPhone Screen in Glasgow? Here's Your Complete Repair Guide

A cracked iPhone screen is one of the most common — and most frustrating — accidents a Glasgow phone owner can face. Whether you dropped it on Buchanan Street or it slipped out of your pocket at Central Station, the good news is you have **excellent local repair options**.

## How Much Does iPhone Screen Repair Cost in Glasgow?

Prices vary by model and whether you choose OEM or premium aftermarket parts:

- **iPhone 11 / 12 / 13**: £80 – £140
- **iPhone 14 / 15**: £120 – £180
- **iPhone Pro Max models**: £150 – £250

At Gadget Repairs Glasgow we always quote before any work begins, and all screen repairs come with a **12-month warranty**.

## How Long Does It Take?

Most screen replacements are completed in **30–90 minutes** while you wait. We keep common parts in stock so you can often walk in and walk out same-day.

## OEM vs Aftermarket — What's the Difference?

- **OEM parts** are made by Apple and identical to the original.
- **Premium aftermarket** parts meet the same specs but cost less.

We'll always explain your options honestly and let you choose.

## Can a Cracked Screen Damage My Phone?

Yes. A cracked screen lets in dust and moisture, which can short-circuit the display assembly and damage the touch digitiser. Get it fixed promptly to avoid a much bigger bill later.

## Why Choose a Local Glasgow Repair Shop?

- Face-to-face service and accountability
- Support a local Trongate business
- No shipping your phone away for weeks
- Walk-in and doorstep collection options

Book your iPhone screen repair online or call **+44 7777 200149** today.`,
      coverImage: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
      category: "Phone Repair", tags: "iPhone,screen repair,Glasgow", author: "Gadget Repairs Glasgow", published: true, featured: true,
    },
    {
      slug: "phone-battery-replacement-signs",
      title: "7 Signs Your Phone Battery Needs Replacing (Before It Swells)",
      excerpt: "Is your phone dying by lunchtime or getting suspiciously hot? Here are the warning signs that say it's time for a battery replacement.",
      content: `# 7 Signs Your Phone Battery Needs Replacing

Phone batteries degrade over time — it's a fact of lithium-ion chemistry. But how do you know when it's time to replace yours?

## 1. Your Phone Dies Before 0%

If your phone shuts off at 15% or 20%, the battery's voltage curve is shot. Time for a replacement.

## 2. It Gets Hot During Normal Use

A healthy battery stays cool. Persistent warmth during browsing or video calls means the cells are straining.

## 3. The Back Is Bulging

**Stop using it immediately.** A swollen battery is a fire risk. Bring it in for safe replacement the same day.

## 4. It Only Lasts Half a Day

If you're hunting for a charger by lunchtime, the capacity has dropped below 80%.

## 5. Random Shutdowns in the Cold

Cold weather reveals weak batteries fast. If your phone dies walking down Argyle Street in winter, the battery is on its way out.

## 6. The Phone Won't Charge Past 80%

Modern phones throttle charging on degraded batteries to protect them.

## 7. Battery Health Below 80%

On iPhone, check Settings → Battery → Battery Health. Below 80% means replacement time.

## Cost of Battery Replacement in Glasgow

- **iPhone**: £40 – £80
- **Samsung Galaxy**: £45 – £90
- **Google Pixel**: £50 – £90

All our batteries come with a **12-month warranty** and most are fitted in under an hour.`,
      coverImage: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
      category: "Battery", tags: "battery,replacement,maintenance", author: "Gadget Repairs Glasgow", published: true, featured: false,
    },
    {
      slug: "phone-unlocking-explained-glasgow",
      title: "Phone Unlocking Explained: Is It Legal & How Does It Work?",
      excerpt: "Thinking about unlocking your phone to switch networks? Here's everything Glasgow customers need to know — including the law.",
      content: `# Phone Unlocking Explained: Is It Legal?

Yes — **phone unlocking is 100% legal** in the UK when you own the device outright. Here's the full picture.

## What Is Phone Unlocking?

A locked phone only works with one network (e.g. EE, Vodafone). Unlocking removes this restriction so you can use any SIM card worldwide.

## Is It Legal?

Absolutely. Since December 2021, UK networks are legally required to unlock your phone on request, free of charge if you own it. Third-party unlocking services like ours are also legal.

## Why Unlock Your Phone?

- **Cheaper tariffs** — switch to any SIM-only deal
- **Travel** — use local SIMs abroad
- **Resale value** — unlocked phones sell for more
- **Gift** — pass it to family on any network

## How Long Does It Take?

- **Software unlock**: 1–24 hours
- **Server IMEI unlock**: 1–5 working days

## Cost in Glasgow

Most unlocks cost **£15 – £45** depending on the brand and network.

## Will Unlocking Void My Warranty?

If done by a reputable shop using official methods, no. We only use safe, permanent factory unlocks.`,
      coverImage: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79a8?w=800&q=80",
      category: "Unlocking", tags: "unlocking,network,SIM", author: "Gadget Repairs Glasgow", published: true, featured: false,
    },
    {
      slug: "water-damaged-phone-what-to-do",
      title: "Dropped Your Phone in Water? Do These 5 Things Immediately",
      excerpt: "A liquid-damaged phone isn't always a write-off. Follow these steps and you could save your device — and your data.",
      content: `# Dropped Your Phone in Water? Do These 5 Things Immediately

Whether it's the River Clyde or a pint at The Horseshoe Bar, water damage doesn't have to mean the end of your phone. Here's what to do — and what NOT to do.

## 1. Turn It Off Immediately

Powering down prevents short-circuits. Don't press any other buttons.

## 2. Don't Put It in Rice

It's a myth. Rice doesn't absorb moisture fast enough and starch dust gets into ports. Use silica gel packets if you have them, or just leave it to air.

## 3. Remove the Case and SIM Tray

Give moisture escape routes. Don't shake the phone.

## 4. Don't Charge It

Charging a wet phone is the #1 cause of permanent motherboard damage.

## 5. Bring It to a Professional Within 48 Hours

The longer corrosion sets in, the lower the recovery chance. Our ultrasonic cleaning service salvages the majority of water-damaged phones.

## What We Do

1. Full diagnostic and moisture assessment
2. Ultrasonic PCB cleaning
3. Component-level repair
4. Data recovery priority
5. No-fix, no-fee guarantee

Most water-damage recoveries cost **£40 – £150** and take 24–72 hours.`,
      coverImage: "https://images.unsplash.com/photo-1512054502232-10a0a035d1a4?w=800&q=80",
      category: "Water Damage", tags: "water damage,repair,emergency", author: "Gadget Repairs Glasgow", published: true, featured: false,
    },
  ];
  for (const p of posts) {
    const existing = await db.blogPost.findUnique({ where: { slug: p.slug } });
    if (existing) await db.blogPost.update({ where: { slug: p.slug }, data: p });
    else await db.blogPost.create({ data: p });
  }

  // ---------- PageContent ----------
  const pages = [
    { page: "home", section: "hero", key: "badge", value: "Glasgow's #1 Gadget Repair Shop" },
    { page: "home", section: "hero", key: "title", value: "Fast, Reliable Phone & Tablet Repairs in Glasgow" },
    { page: "home", section: "hero", key: "subtitle", value: "Cracked screens, dead batteries, water damage & unlocks — fixed the same day on Trongate. 10+ years, 4.9★ from 150+ reviews." },
    { page: "services", section: "hero", key: "title", value: "Our Repair Services" },
    { page: "collection", section: "hero", key: "title", value: "Free Doorstep Collection Across Glasgow" },
    { page: "reviews", section: "hero", key: "title", value: "What Glasgow Says About Us" },
    { page: "contact", section: "hero", key: "title", value: "Get In Touch" },
    { page: "blog", section: "hero", key: "title", value: "Gadget Repairs Glasgow Blog" },
  ];
  for (const p of pages) {
    const existing = await db.pageContent.findUnique({ where: { page_section_key: { page: p.page, section: p.section, key: p.key } } });
    if (!existing) await db.pageContent.create({ data: p });
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
