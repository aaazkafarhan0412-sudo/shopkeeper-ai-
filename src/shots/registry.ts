export type ShotGroup = "boards" | "devices" | "desktop" | "mobile";

export type ShotDef = {
  id: string;
  group: ShotGroup;
  title: string;
  note: string;
  /** File name without extension, e.g. "01-cover". */
  file: string;
  /** Viewport width the screen is rendered at (CSS px). */
  width: number;
  /** Fixed height, or "auto" to capture the full content height. */
  height: number | "auto";
  /** Height of the preview crop shown in the media kit (defaults to the full height). */
  previewHeight?: number;
  /** Exported with a transparent background (always PNG). */
  transparent?: boolean;
  /** Used internally (e.g. inside the responsive board) but not listed in the media kit. */
  hidden?: boolean;
};

export type GroupDef = {
  id: ShotGroup;
  title: string;
  description: string;
  folder: string;
  /** Scale used by the "Recommended" resolution setting. */
  recommended: number;
};

export const GROUPS: GroupDef[] = [
  {
    id: "boards",
    title: "Showcase boards",
    description:
      "1600 × 1200 artboards in Dribbble's 4:3 ratio, ready for Dribbble, Behance and case-study slides.",
    folder: "01-showcase-boards",
    recommended: 2,
  },
  {
    id: "devices",
    title: "Device mockups",
    description: "Phone screens on a transparent background. Drop them onto any slide, colour or layout.",
    folder: "02-device-mockups",
    recommended: 3,
  },
  {
    id: "desktop",
    title: "Website — desktop",
    description: "Every section of the real landing page at 1440 px, the standard desktop design width.",
    folder: "03-website-desktop",
    recommended: 2,
  },
  {
    id: "mobile",
    title: "Website — mobile",
    description: "The same website at 390 px. Exported at 3× these match a native iPhone screen (1170 × 2532).",
    folder: "04-website-mobile",
    recommended: 3,
  },
];

const board = (id: string, file: string, title: string, note: string): ShotDef => ({
  id,
  file,
  title,
  note,
  group: "boards",
  width: 1600,
  height: 1200,
});

const device = (id: string, file: string, title: string, note: string): ShotDef => ({
  id,
  file,
  title,
  note,
  group: "devices",
  width: 360,
  height: 700,
  transparent: true,
});

const desktop = (id: string, file: string, title: string, note: string): ShotDef => ({
  id,
  file,
  title,
  note,
  group: "desktop",
  width: 1440,
  height: "auto",
  previewHeight: 900,
});

const mobile = (id: string, file: string, title: string, note: string, height: number | "auto" = 844): ShotDef => ({
  id,
  file,
  title,
  note,
  group: "mobile",
  width: 390,
  height,
  previewHeight: 844,
});

export const SHOTS: ShotDef[] = [
  board("board-cover", "01-cover", "Cover", "Project thumbnail for Dribbble, Behance or your case study."),
  board("board-mobile", "02-mobile-app", "Mobile app — 3 screens", "Khata home, customer profile and WhatsApp reminder."),
  board("board-dashboard", "03-web-dashboard", "Web dashboard", "Stats, live transactions, customer list and quick entry."),
  board("board-profile", "04-customer-profile", "Customer profile + WhatsApp", "Ahmed Khan · Rs. 4,500 · the reminder flow."),
  board("board-design", "05-design-system", "Design system", "Colours, typography, components, icons and spacing."),
  board("board-responsive", "06-responsive", "Responsive — desktop + mobile", "The same product at 1440 px and 390 px."),

  device("device-home", "01-khata-home", "Khata home", "Receivables, search and customer balances."),
  device("device-customer", "02-customer-profile", "Customer profile", "Balance, transaction history and actions."),
  device("device-entry", "03-add-transaction", "Add transaction", "Udhaar or payment with a big, simple keypad."),
  device("device-reminder", "04-whatsapp-reminder", "WhatsApp reminder", "Message preview, language and send."),

  desktop("web-hero", "01-hero", "Hero", "Navigation, headline, CTAs and product visual."),
  desktop("web-problem", "02-problem", "Problem", "Why the paper khata needs an upgrade."),
  desktop("web-features", "03-features", "Features", "Six-feature bento grid with mini product UIs."),
  desktop("web-how", "04-how-it-works", "How it works", "Three steps with product snippets."),
  desktop("web-dashboard", "05-dashboard", "Dashboard preview", "The full dashboard section."),
  desktop("web-profile", "06-customer-profile", "Customer profile", "Ahmed Khan's complete hisaab."),
  desktop("web-whatsapp", "07-whatsapp", "WhatsApp", "Your khata meets WhatsApp."),
  desktop("web-trust", "08-for-shopkeepers", "For shopkeepers", "Trust points and testimonials."),
  desktop("web-faq", "09-faq", "FAQ", "Accordion with support card."),
  desktop("web-cta", "10-cta-footer", "Final CTA + footer", "Closing call to action and footer."),
  desktop("web-full", "11-full-page", "Full landing page", "Every section in one long image."),

  mobile("m-hero", "01-hero", "Hero", "Mobile navigation and headline."),
  mobile("m-features", "02-features", "Features", "Feature tiles stacked for small screens."),
  mobile("m-profile", "03-customer-profile", "Customer profile", "The profile card at 390 px."),
  mobile("m-full", "04-full-page", "Full page", "The entire mobile website in one image.", "auto"),

  {
    id: "d-hero",
    group: "desktop",
    title: "Desktop hero (crop)",
    note: "Used inside the responsive board.",
    file: "desktop-hero-crop",
    width: 1440,
    height: 900,
    hidden: true,
  },
];

export function getShot(id: string): ShotDef | undefined {
  return SHOTS.find((s) => s.id === id);
}
