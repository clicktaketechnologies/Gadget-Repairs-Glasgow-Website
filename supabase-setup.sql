-- ============================================================
-- Gadget Repairs Glasgow — Supabase Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. Drop existing tables (clean slate)
-- ============================================================
DROP TABLE IF EXISTS "SentEmail" CASCADE;
DROP TABLE IF EXISTS "EmailSettings" CASCADE;
DROP TABLE IF EXISTS "PageContent" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "Branding" CASCADE;
DROP TABLE IF EXISTS "SiteSettings" CASCADE;
DROP TABLE IF EXISTS "AdminUser" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Booking" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;

-- ============================================================
-- 2. Create tables
-- ============================================================

-- Service
CREATE TABLE "Service" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT DEFAULT 'Wrench',
    "priceFrom" TEXT,
    "priceTo" TEXT,
    "turnaround" TEXT,
    "popular" BOOLEAN DEFAULT false,
    "active" BOOLEAN DEFAULT true,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Service_category_idx" ON "Service"("category");
CREATE INDEX "Service_active_idx" ON "Service"("active");

-- Booking
CREATE TABLE "Booking" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "ticketId" TEXT UNIQUE NOT NULL,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceModel" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "needsCollection" BOOLEAN DEFAULT false,
    "collectionAddr" TEXT,
    "status" TEXT DEFAULT 'Pending',
    "technicianNotes" TEXT,
    "quotedPrice" TEXT,
    "finalPrice" TEXT,
    "source" TEXT DEFAULT 'online',
    "bookingDate" TEXT,
    "bookingTime" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Booking_source_idx" ON "Booking"("source");
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- Review
CREATE TABLE "Review" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "device" TEXT,
    "source" TEXT DEFAULT 'online',
    "approved" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Review_approved_idx" ON "Review"("approved");
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- AdminUser
CREATE TABLE "AdminUser" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SiteSettings
CREATE TABLE "SiteSettings" (
    "id" TEXT PRIMARY KEY DEFAULT 'singleton',
    "collectionEnabled" BOOLEAN DEFAULT true,
    "collectionBannerEnabled" BOOLEAN DEFAULT true,
    "announcementEnabled" BOOLEAN DEFAULT false,
    "announcementText" TEXT,
    "ticketIdVisible" BOOLEAN DEFAULT true,
    "customHeaderCode" TEXT,
    "customFooterCode" TEXT,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branding
CREATE TABLE "Branding" (
    "id" TEXT PRIMARY KEY DEFAULT 'singleton',
    "businessName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryColor" TEXT DEFAULT '#1b4f8e',
    "secondaryColor" TEXT DEFAULT '#f05a28',
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "gmbProfile" TEXT,
    "mapLink" TEXT,
    "mapEmbed" TEXT,
    "address" TEXT NOT NULL,
    "hoursJson" TEXT,
    "socialsJson" TEXT,
    "targetAreasJson" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 4.9,
    "reviewCount" INTEGER DEFAULT 150,
    "yearsExperience" INTEGER DEFAULT 10,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BlogPost
CREATE TABLE "BlogPost" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug" TEXT UNIQUE NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT DEFAULT 'General',
    "tags" TEXT,
    "author" TEXT DEFAULT 'Gadget Repairs Glasgow',
    "published" BOOLEAN DEFAULT false,
    "featured" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "BlogPost_published_idx" ON "BlogPost"("published");
CREATE INDEX "BlogPost_category_idx" ON "BlogPost"("category");

-- PageContent
CREATE TABLE "PageContent" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("page", "section", "key")
);
CREATE INDEX "PageContent_page_idx" ON "PageContent"("page");

-- EmailSettings
CREATE TABLE "EmailSettings" (
    "id" TEXT PRIMARY KEY DEFAULT 'singleton',
    "enabled" BOOLEAN DEFAULT false,
    "host" TEXT,
    "port" INTEGER DEFAULT 587,
    "secure" BOOLEAN DEFAULT false,
    "user" TEXT,
    "password" TEXT,
    "fromEmail" TEXT,
    "fromName" TEXT,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SentEmail
CREATE TABLE "SentEmail" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT DEFAULT 'sent',
    "relatedBookingId" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "SentEmail_relatedBookingId_idx" ON "SentEmail"("relatedBookingId");
CREATE INDEX "SentEmail_createdAt_idx" ON "SentEmail"("createdAt");

-- ============================================================
-- 3. Seed Data
-- ============================================================

-- Admin User (email: admin@gadgetrepairsglasgow.co.uk / password: securepassword123)
INSERT INTO "AdminUser" ("email", "name", "password") VALUES
('admin@gadgetrepairsglasgow.co.uk', 'Store Admin', 'securepassword123');

-- Site Settings
INSERT INTO "SiteSettings" ("id", "collectionEnabled", "collectionBannerEnabled", "announcementEnabled", "announcementText", "ticketIdVisible") VALUES
('singleton', true, true, true, '🎉 Free doorstep collection across Glasgow — book online today!', true);

-- Email Settings
INSERT INTO "EmailSettings" ("id", "enabled", "host", "port", "secure", "fromEmail", "fromName") VALUES
('singleton', false, 'smtp.gmail.com', 587, false, 'info@gadgetrepairsglasgow.co.uk', 'Gadget Repairs Glasgow');

-- Branding
INSERT INTO "Branding" (
    "id", "businessName", "tagline", "about", "logoUrl", "faviconUrl",
    "primaryColor", "secondaryColor", "phone", "whatsapp", "email",
    "website", "gmbProfile", "mapLink", "mapEmbed", "address",
    "hoursJson", "socialsJson", "targetAreasJson", "rating", "reviewCount", "yearsExperience"
) VALUES (
    'singleton',
    'Gadget Repairs Glasgow',
    'Professional Mobile Phone & Tablet Repair, Unlocking, and Accessories',
    'Gadget Repairs Glasgow is a trusted repair shop at 172 Trongate in Glasgow city centre. For over 10 years we have been fixing mobile phones, MacBooks, laptops, tablets, game consoles, computers, smart watches and GHD straighteners for thousands of happy customers. Our certified technicians use premium parts and offer a no-fix, no-fee guarantee on most repairs. Walk in, book online, or use our free doorstep collection service — most repairs are completed the same day.',
    '/logo.jpg', '/logo.jpg',
    '#1b4f8e', '#f05a28',
    '+44 7777 200149', '+44 7777 200149', 'info@gadgetrepairsglasgow.co.uk',
    'https://www.gadgetrepairsglasgow.co.uk', 'https://g.co/kgs/DKcPKfJ',
    'https://maps.google.com/?q=172+Trongate+Glasgow+UK',
    'https://www.google.com/maps?q=172+Trongate+Glasgow+UK&output=embed',
    '172 Trongate, Glasgow, UK',
    '[{"day":"Monday","hours":"9:00 AM – 7:00 PM"},{"day":"Tuesday","hours":"9:00 AM – 7:00 PM"},{"day":"Wednesday","hours":"9:00 AM – 7:00 PM"},{"day":"Thursday","hours":"9:00 AM – 7:00 PM"},{"day":"Friday","hours":"9:00 AM – 7:00 PM"},{"day":"Saturday","hours":"9:00 AM – 7:00 PM"},{"day":"Sunday","hours":"10:30 AM – 5:30 PM"}]',
    '[{"name":"Facebook","url":"https://www.facebook.com/gadgetrepairglasgow"},{"name":"Instagram","url":"https://www.instagram.com/gadgetrepairsglasgow/"},{"name":"TikTok","url":"https://www.tiktok.com/@gadgetrepairsglasgow"},{"name":"YouTube","url":"https://www.youtube.com/@Gadgetrepairsglassgow"},{"name":"LinkedIn","url":"https://www.linkedin.com/company/gadgetrepairsglasgow/"}]',
    '["Trongate","Glasgow City Centre","Merchant City","Buchanan Street","Dennistoun","Gorbals"]',
    4.9, 150, 10
);

-- Services (8 repair services)
INSERT INTO "Service" ("slug", "name", "category", "description", "icon", "priceFrom", "priceTo", "turnaround", "popular", "active", "sortOrder") VALUES
('mobile-repair', 'Mobile Repair Service', 'Mobile Repair', 'Professional repair for all smartphones — cracked screens, battery replacement, charging port fixes, water damage recovery, and software issues. iPhone, Samsung, Google Pixel, Huawei, Xiaomi and all major brands. Same-day service with 12-month warranty.', 'Smartphone', '£25', '£250', '30 min – 2 hours', true, true, 1),
('macbook-repair', 'MacBook Repair Service', 'MacBook Repair', 'Expert MacBook, MacBook Pro and MacBook Air repair — screen replacement, battery, keyboard, trackpad, logic board diagnostics, and liquid damage recovery. Genuine Apple parts available with 12-month warranty.', 'Laptop', '£60', '£450', '1 – 3 days', true, true, 2),
('laptop-repair', 'Laptop Repair Service', 'Laptop Repair', 'Comprehensive laptop repair for all brands — Dell, HP, Lenovo, ASUS, Acer, Microsoft Surface and more. Screen replacement, keyboard, battery, charging port, hinge repair, data recovery, and virus removal.', 'Laptop', '£40', '£300', '1 – 2 days', true, true, 3),
('ghd-repair', 'GHD Repair Service', 'GHD Repair', 'Professional GHD hair straightener repair — won''t heat, broken cable, flashing light, plate replacement, and thermal fuse issues. All GHD models serviced including Classic, Gold, Platinum, and Curve. Fast turnaround, genuine parts.', 'Zap', '£20', '£60', '1 – 2 hours', false, true, 4),
('tablet-repair', 'Tablet Repair Service', 'Tablet Repair', 'Tablet and iPad repair — screen replacement, battery, charging port, speaker, button and camera fixes. Apple iPad, Samsung Galaxy Tab, Microsoft Surface, Amazon Fire, Lenovo Tab and more.', 'Tablet', '£40', '£220', '1 – 3 hours', true, true, 5),
('game-console-repair', 'Game Console Repair Service', 'Game Console Repair', 'Game console repair for PlayStation, Xbox, Nintendo Switch and more. HDMI port replacement, disc drive repair, overheating/fan issues, controller drift, power supply, and software problems.', 'Gamepad2', '£35', '£200', '1 – 3 days', false, true, 6),
('computer-repair', 'Computer Repair Service', 'Computer Repair', 'Desktop PC and iMac repair — hardware upgrades, RAM/SSD installation, virus removal, OS reinstall, power supply replacement, GPU issues, and custom builds. Diagnostics, data recovery, and performance optimization.', 'Monitor', '£35', '£350', '1 – 3 days', false, true, 7),
('smart-watch-repair', 'Smart Watch Repair Service', 'Smart Watch Repair', 'Smart watch repair for Apple Watch, Samsung Galaxy Watch, Fitbit, Garmin and more. Screen/glass replacement, battery, water damage, button/crown repair, and strap replacement.', 'Watch', '£30', '£180', '1 – 2 hours', false, true, 8);

-- Reviews (8 sample reviews)
INSERT INTO "Review" ("author", "rating", "comment", "device", "source", "approved", "createdAt") VALUES
('Mark Thompson', 5, 'Cracked iPhone 14 Pro screen replaced in 40 minutes. Looks brand new and works perfectly. Best price in Glasgow by far!', 'iPhone 14 Pro', 'Google', true, '2025-10-15 10:00:00'),
('Sarah McLean', 5, 'My Samsung battery was dying by lunchtime. Gadget Repairs swapped it the same day and now it lasts two days. Friendly staff and honest advice.', 'Samsung Galaxy S22', 'Google', true, '2025-10-12 14:30:00'),
('David Wilson', 5, 'MacBook Pro keyboard was failing. These guys replaced it for half what Apple quoted. Genuine part, 12-month warranty. Highly recommend.', 'MacBook Pro 2019', 'Google', true, '2025-10-10 09:15:00'),
('Aisha Rahman', 5, 'My GHD straighteners stopped heating. Thought I''d need new ones but they fixed the thermal fuse in an hour for £25. Brilliant service!', 'GHD Platinum+', 'Walk-in', true, '2025-10-08 16:45:00'),
('James O''Brien', 4, 'PS5 HDMI port was broken. Repair took 2 days but works perfectly now. Fair price and they kept me informed throughout.', 'PlayStation 5', 'Google', true, '2025-10-05 11:20:00'),
('Katie Donaldson', 5, 'iPad screen shattered. Fixed it for half what Apple quoted and collected from my office for free. Honest business.', 'iPad Air 5', 'Google', true, '2025-10-03 13:00:00'),
('Steven Reid', 5, 'Apple Watch screen cracked. Replaced same day, waterproofing tested. Reasonable price and friendly service.', 'Apple Watch Series 8', 'Instagram', true, '2025-10-01 15:30:00'),
('Lisa Cameron', 5, 'Laptop was running slow and full of viruses. Cleaned it up, installed SSD, now flies. Way cheaper than buying new.', 'Dell XPS 13', 'Walk-in', true, '2025-09-28 10:00:00');

-- Blog Posts (4 sample posts)
INSERT INTO "BlogPost" ("slug", "title", "excerpt", "content", "coverImage", "category", "tags", "author", "published", "featured", "createdAt", "updatedAt") VALUES
('cracked-iphone-screen-glasgow-guide', 'Cracked iPhone Screen in Glasgow? Here''s Your Complete Repair Guide', 'Everything you need to know about getting your iPhone screen fixed in Glasgow.', '# Cracked iPhone Screen in Glasgow?

A cracked iPhone screen is one of the most common accidents. The good news is you have excellent local repair options.

## Cost

- iPhone 11/12/13: £80–£140
- iPhone 14/15: £120–£180
- iPhone Pro Max: £150–£250

## Turnaround

Most screen replacements are completed in 30–90 minutes.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', 'Mobile Repair', 'iPhone,screen repair', 'Gadget Repairs Glasgow', true, true, '2025-10-20 10:00:00', '2025-10-20 10:00:00'),
('macbook-repair-glasgow-guide', 'MacBook Repair in Glasgow: Costs, Common Issues & What to Expect', 'MacBook not turning on? Keyboard failing? Screen damaged? Here''s everything Glasgow MacBook owners need to know.', '# MacBook Repair in Glasgow

## Common Issues

- Keyboard failure
- Screen damage
- Battery swelling
- Liquid damage

## Costs

- Battery: £80–£150
- Keyboard: £120–£250
- Screen: £200–£450', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 'MacBook Repair', 'MacBook,repair', 'Gadget Repairs Glasgow', true, false, '2025-10-19 10:00:00', '2025-10-19 10:00:00'),
('ghd-straightener-repair-guide', 'GHD Won''t Heat? Common Faults & How Much GHD Repair Costs', 'GHD straighteners stopped working? Here''s what''s wrong and how much it costs to fix.', '# GHD Repair Guide

## Common Faults

- Won''t heat up (thermal fuse)
- Flashing red light
- Broken cable

## Cost: £20–£60', 'https://images.unsplash.com/photo-1522335789203-aaa9cbb96e9d?w=800&q=80', 'GHD Repair', 'GHD,straightener', 'Gadget Repairs Glasgow', true, false, '2025-10-18 10:00:00', '2025-10-18 10:00:00'),
('ps5-xbox-hdmi-port-repair', 'PS5/Xbox HDMI Port Broken? Console Repair Guide for Glasgow Gamers', 'No signal on your PS5 or Xbox? HDMI port damaged? Here''s how much console repair costs.', '# Game Console HDMI Repair

## Common Issues

- HDMI port damage
- Disc drive not reading
- Overheating
- Controller drift

## Cost: £35–£200', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80', 'Game Console Repair', 'PS5,Xbox,HDMI', 'Gadget Repairs Glasgow', true, false, '2025-10-17 10:00:00', '2025-10-17 10:00:00');

-- ============================================================
-- 4. Create updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updatedAt
CREATE TRIGGER update_Service_updatedAt BEFORE UPDATE ON "Service" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Booking_updatedAt BEFORE UPDATE ON "Booking" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_AdminUser_updatedAt BEFORE UPDATE ON "AdminUser" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_SiteSettings_updatedAt BEFORE UPDATE ON "SiteSettings" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Branding_updatedAt BEFORE UPDATE ON "Branding" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_BlogPost_updatedAt BEFORE UPDATE ON "BlogPost" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_PageContent_updatedAt BEFORE UPDATE ON "PageContent" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_EmailSettings_updatedAt BEFORE UPDATE ON "EmailSettings" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Done! All 10 tables created + seed data inserted.
-- ============================================================
