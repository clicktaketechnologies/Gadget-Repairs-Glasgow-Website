"use client";

import { useNav } from "@/store/nav";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { OverviewModule } from "./modules/OverviewModule";
import { BookingsModule } from "./modules/BookingsModule";
import { WalkinModule } from "./modules/WalkinModule";
import { ServicesModule } from "./modules/ServicesModule";
import { ReviewsModule } from "./modules/ReviewsModule";
import { BlogModule } from "./modules/BlogModule";
import { PagesModule } from "./modules/PagesModule";
import { ContentModule } from "./modules/ContentModule";
import { BrandingModule } from "./modules/BrandingModule";
import { EmailModule } from "./modules/EmailModule";
import { CodeModule } from "./modules/CodeModule";
import { SettingsModule } from "./modules/SettingsModule";

export function AdminApp() {
  const adminToken = useNav((s) => s.adminToken);
  const route = useNav((s) => s.route);

  if (!adminToken) {
    return <AdminLogin />;
  }

  const page = route.kind === "admin" ? route.page : "admin-overview";

  let content: React.ReactNode;
  switch (page) {
    case "admin-overview":
      content = <OverviewModule />;
      break;
    case "admin-bookings":
      content = <BookingsModule />;
      break;
    case "admin-walkin":
      content = <WalkinModule />;
      break;
    case "admin-services":
      content = <ServicesModule />;
      break;
    case "admin-reviews":
      content = <ReviewsModule />;
      break;
    case "admin-blog":
      content = <BlogModule />;
      break;
    case "admin-pages":
      content = <PagesModule />;
      break;
    case "admin-content":
      content = <ContentModule />;
      break;
    case "admin-branding":
      content = <BrandingModule />;
      break;
    case "admin-email":
      content = <EmailModule />;
      break;
    case "admin-code":
      content = <CodeModule />;
      break;
    case "admin-settings":
      content = <SettingsModule />;
      break;
    default:
      content = <OverviewModule />;
  }

  return <AdminLayout>{content}</AdminLayout>;
}
