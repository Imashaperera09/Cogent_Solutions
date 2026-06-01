export interface Speaker {
  name: string;
  role: string;
  company: string;
  initials: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  type: string;
  speaker: string;
}

export interface ReasonItem {
  iconName: "zap" | "award" | "shield";
  title: string;
  desc: string;
}

export const SPEAKERS: Speaker[] = [
  { name: "Dr. Raman Kumar",       role: "CEO",                                  company: "Al-Futtaim Logistics",  initials: "RK" },
  { name: "David Moono",           role: "Global Logistics Manager",             company: "Weatherford",           initials: "DM" },
  { name: "Tamer Hamed",           role: "CIO",                                  company: "Dubai Cable Company",   initials: "TH" },
  { name: "Richard Buxton",        role: "VP EMEA",                              company: "Accelalpha",            initials: "RB" },
  { name: "Joe Spear",             role: "Partner",                              company: "Accelalpha",            initials: "JS" },
  { name: "Srivatsav Sarvepalli",  role: "Regional Director, SC Solutions ECEMEA", company: "Oracle",             initials: "SS" },
  { name: "Rohan Chitnis",         role: "Sales Director Applications",          company: "Oracle",                initials: "RC" },
  { name: "Ujjwal Kumar",          role: "Principal Domain Lead, ECEMEA",        company: "Oracle",                initials: "UK" },
];

export const AGENDA: AgendaItem[] = [
  { time: "09:30 – 10:00", title: "Registrations",                                     type: "Break",    speaker: "Event Operations Team" },
  { time: "10:00 – 10:10", title: "Welcome Note",                                       type: "Opening",  speaker: "Richard Buxton & Rohan Chitnis" },
  { time: "10:10 – 10:40", title: "Industry Keynote: Outlook & Challenges on Digital Logistics & Supply Chain", type: "Keynote",  speaker: "Srivatsav Sarvepalli" },
  { time: "10:40 – 11:10", title: "A Practical Guide to Successful Implementation",     type: "Workshop", speaker: "Joe Spear" },
  { time: "11:10 – 11:30", title: "The Resilient Supply Chain & SCM Innovations",       type: "Keynote",  speaker: "Ujjwal Kumar" },
  { time: "11:30 – 11:50", title: "Coffee Break",                                       type: "Break",    speaker: "Networking" },
  { time: "11:50 – 12:10", title: "Insights from Digital Evolution",                    type: "Session",  speaker: "Dr. Raman Kumar" },
  { time: "12:10 – 12:40", title: "Strategies in Action: Insights from Industry Leaders", type: "Panel", speaker: "David Moono & Tamer Hamed" },
  { time: "12:40 – 01:00", title: "Q&A and Closing Remarks",                            type: "Closing",  speaker: "Accelalpha Team" },
  { time: "01:00 PM+",     title: "Lunch & Networking",                                 type: "Break",    speaker: "Open Networking" },
];

export const REASONS: ReasonItem[] = [
  {
    iconName: "zap",
    title: "Oracle's Gen AI SCM Platform Unveiled",
    desc: "Explore how Oracle's AI-powered SCM innovations offer predictive analytics, automation, improved visibility, and sustainability into supply chains like yours.",
  },
  {
    iconName: "award",
    title: "Customer Success Stories That Deliver Results",
    desc: "Hear how companies partnered with Oracle and Accelalpha to optimize logistics flows, cut costs, and improve resilience through smarter inventory management.",
  },
  {
    iconName: "shield",
    title: "Practical Solutions for Green & Resilient Operations",
    desc: "Learn how to navigate geopolitical risks, last-mile delivery challenges, and integrate eco-friendly practices — keeping operations agile in the Gulf market.",
  },
];

export const FILTER_TYPES = ["All", "Keynote", "Workshop", "Panel", "Session", "Opening", "Closing", "Break"];

export const TYPE_CLASS: Record<string, string> = {
  Keynote:  "type-keynote",
  Panel:    "type-panel",
  Workshop: "type-workshop",
  Opening:  "type-opening",
  Closing:  "type-closing",
  Break:    "type-break",
  Session:  "type-session",
};
