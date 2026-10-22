"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Mail, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/site/Section";
import { useNav } from "@/store/nav";
import { telDigits } from "../lib";

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "intro",
    title: "1. Introduction",
    body: (
      <>
        <p>
          Gadget Repairs Glasgow (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
          is committed to protecting and respecting your privacy. This Privacy
          Policy explains how we collect, use, store, and protect your personal
          data when you use our website{" "}
          <a
            href="https://www.gadgetrepairsglasgow.co.uk"
            className="text-blue-700 underline"
          >
            www.gadgetrepairsglasgow.co.uk
          </a>{" "}
          and our repair services.
        </p>
        <p>
          We are a phone, MacBook, laptop, GHD, tablet, game console, computer
          and smart watch repair shop located at 172 Trongate, Glasgow, UK.
        </p>
      </>
    ),
  },
  {
    id: "controller",
    title: "2. Data Controller",
    body: (
      <>
        <p>
          Gadget Repairs Glasgow is the data controller for the personal
          information we collect through this website and our repair services.
        </p>
        <p>
          If you have any questions about how we handle your personal data,
          please contact us using the details in Section 14 below.
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "3. Data We Collect",
    body: (
      <>
        <p>We may collect and process the following categories of data:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Contact information:</strong> name, email address, phone
            number.
          </li>
          <li>
            <strong>Booking information:</strong> device type, model, fault
            description, collection address, preferred date/time.
          </li>
          <li>
            <strong>Repair records:</strong> ticket ID, technician notes,
            quoted price, repair status, photos of the device where relevant.
          </li>
          <li>
            <strong>Marketing data:</strong> reviews you submit (name, rating,
            device, comment).
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, pages
            visited (via cookies and analytics).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "4. How We Use Your Data",
    body: (
      <>
        <p>We use your personal data for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide repair quotes, book and complete repairs.</li>
          <li>To arrange free doorstep collection and delivery.</li>
          <li>To contact you about your repair status and ticket updates.</li>
          <li>To process payments and issue invoices/receipts.</li>
          <li>To publish reviews you choose to submit (after moderation).</li>
          <li>To respond to enquiries, complaints and support requests.</li>
          <li>To improve our website, services and customer experience.</li>
          <li>To comply with legal and regulatory obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "5. Legal Basis for Processing",
    body: (
      <>
        <p>We process your personal data under the following legal bases:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Contract:</strong> to fulfil our repair service agreement
            with you.
          </li>
          <li>
            <strong>Consent:</strong> for marketing communications, cookies and
            publishing reviews.
          </li>
          <li>
            <strong>Legal obligation:</strong> to maintain records for tax,
            accounting and consumer-protection law.
          </li>
          <li>
            <strong>Legitimate interests:</strong> for fraud prevention,
            service improvement and security.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "6. Sharing Your Data",
    body: (
      <>
        <p>
          We do not sell your personal data. We may share it with the following
          categories of recipients where necessary:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Parts suppliers and delivery partners for fulfilment.</li>
          <li>
            Payment processors and accounting software (e.g. Stripe, Xero) for
            invoicing.
          </li>
          <li>
            IT service providers (e.g. hosting, email) under appropriate
            data-processing agreements.
          </li>
          <li>
            Law enforcement or regulators where legally required to disclose.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "international",
    title: "7. International Transfers",
    body: (
      <p>
        Your personal data is stored and processed primarily within the United
        Kingdom and European Economic Area. Where any data is transferred
        outside the UK/EEA, we ensure appropriate safeguards are in place (such
        as Standard Contractual Clauses) to protect your data.
      </p>
    ),
  },
  {
    id: "retention",
    title: "8. Data Retention",
    body: (
      <>
        <p>We retain your personal data only for as long as necessary:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Repair records:</strong> 6 years from the date of repair
            (for warranty and consumer-law purposes).
          </li>
          <li>
            <strong>Marketing data:</strong> until you opt out or 24 months of
            inactivity.
          </li>
          <li>
            <strong>Reviews:</strong> for as long as the review remains
            published on our site.
          </li>
          <li>
            <strong>Technical/analytics data:</strong> up to 26 months.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "9. Data Security",
    body: (
      <p>
        We implement appropriate technical and organisational measures to
        protect your personal data, including HTTPS encryption, secure server
        hosting, restricted internal access, and regular security reviews.
        However, no method of internet transmission or electronic storage is
        100% secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "10. Your Rights (UK GDPR)",
    body: (
      <>
        <p>Under the UK GDPR you have the following rights:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The right to be informed about how we use your data.</li>
          <li>The right of access to your personal data.</li>
          <li>The right to rectification of inaccurate data.</li>
          <li>The right to erasure (&quot;right to be forgotten&quot;).</li>
          <li>The right to restrict or object to processing.</li>
          <li>The right to data portability.</li>
          <li>The right to withdraw consent at any time.</li>
          <li>
            The right to lodge a complaint with the Information
            Commissioner&apos;s Office (ICO).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "11. Cookies",
    body: (
      <p>
        We use essential cookies to operate the website (e.g. session state,
        shopping cart) and analytics cookies to understand traffic. You can
        control cookies via your browser settings. We do not use cookies for
        intrusive cross-site tracking.
      </p>
    ),
  },
  {
    id: "children",
    title: "12. Children's Privacy",
    body: (
      <p>
        Our services are not directed at children under 16, and we do not
        knowingly collect personal data from anyone under 16. If you believe we
        have collected data from a child, please contact us and we will delete
        it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "13. Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices, technology, or legal requirements. The updated
        version will be posted on this page with a new effective date. We
        encourage you to review this page periodically.
      </p>
    ),
  },
  {
    id: "contact",
    title: "14. Contact Us",
    body: (
      <>
        <p>
          If you have any questions about this Privacy Policy or your personal
          data, please contact us:
        </p>
        <ul className="list-none space-y-1">
          <li>
            <strong>Address:</strong> 172 Trongate, Glasgow, UK
          </li>
          <li>
            <strong>Phone:</strong> +44 7777 200149
          </li>
          <li>
            <strong>Email:</strong> info@gadgetrepairsglasgow.co.uk
          </li>
        </ul>
        <p>
          You may also lodge a complaint with the ICO at{" "}
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline"
          >
            ico.org.uk
          </a>
          .
        </p>
      </>
    ),
  },
];

export function PrivacyPage() {
  const branding = useNav((s) => s.branding);
  const goContact = useNav((s) => s.goContact);

  const phone = branding?.phone ?? "+44 7777 200149";
  const phoneDigits = telDigits(phone);
  const email = branding?.email ?? "info@gadgetrepairsglasgow.co.uk";

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <Section className="py-10 sm:py-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl space-y-4"
          >
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Privacy Policy
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-blue-100 text-sm sm:text-base">
              How Gadget Repairs Glasgow collects, uses, stores and protects
              your personal data. UK GDPR compliant.
            </p>
            <p className="text-xs text-blue-200">
              Last updated: October 2025 · Effective from: October 2025
            </p>
          </motion.div>
        </Section>
      </section>

      <Section className="py-10 sm:py-12">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sticky TOC */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-2">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                Contents
              </p>
              <nav className="space-y-0.5 text-sm">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-zinc-600 hover:text-blue-700 py-1.5 min-h-9 border-l-2 border-transparent hover:border-blue-500 pl-2"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <div className="lg:col-span-3 space-y-8 min-w-0">
            <Card className="border-zinc-200 bg-blue-50">
              <CardContent className="p-4 flex items-start gap-3">
                <ShieldCheck className="size-5 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-700">
                  We take your privacy seriously. This policy sets out what data
                  we collect, why we collect it, and the rights you have over
                  your personal information.
                </p>
              </CardContent>
            </Card>

            {SECTIONS.map((s) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3 }}
                className="scroll-mt-32"
              >
                <h2 className="text-xl font-bold text-blue-900 mb-3">
                  {s.title}
                </h2>
                <div className="prose prose-sm max-w-none prose-p:text-zinc-700 prose-li:text-zinc-700 prose-strong:text-zinc-900">
                  {s.body}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-blue-950 text-white">
        <Section className="py-10 sm:py-12 text-center">
          <FileText className="size-10 text-orange-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold mt-3">
            Questions about your privacy?
          </h2>
          <p className="text-blue-200 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Email us at{" "}
            <a
              href={`mailto:${email}`}
              className="text-orange-300 underline break-all"
            >
              {email}
            </a>{" "}
            or call{" "}
            <a
              href={`tel:${phoneDigits}`}
              className="text-orange-300 underline"
            >
              {phone}
            </a>
            .
          </p>
          <div className="mt-4">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white h-11"
              onClick={() => goContact()}
            >
              <Mail className="size-4" />
              Contact Us
            </Button>
          </div>
        </Section>
      </section>
    </>
  );
}

export { PrivacyPage as default, PrivacyPage };
