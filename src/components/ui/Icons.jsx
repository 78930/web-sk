// Lightweight inline SVG icons (no external icon dependency).
// All accept className and inherit currentColor.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export const Icon = {
  Menu: (p) => (
    <svg {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
  ),
  Close: (p) => (
    <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  Sun: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  ),
  Moon: (p) => (
    <svg {...base} {...p}><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" /></svg>
  ),
  Search: (p) => (
    <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
  ),
  MapPin: (p) => (
    <svg {...base} {...p}><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
  ),
  Clock: (p) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  Wallet: (p) => (
    <svg {...base} {...p}><path d="M3 7a2 2 0 012-2h11a2 2 0 012 2v0H5a2 2 0 00-2 2z" /><path d="M3 9h16a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><circle cx="16" cy="14" r="1" /></svg>
  ),
  Briefcase: (p) => (
    <svg {...base} {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" /></svg>
  ),
  Users: (p) => (
    <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-5-5.9" /></svg>
  ),
  Check: (p) => (
    <svg {...base} {...p}><path d="M5 12l4 4L19 6" /></svg>
  ),
  CheckCircle: (p) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></svg>
  ),
  Star: (p) => (
    <svg {...base} {...p}><path d="M12 4l2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 15.9 7.3 18.3l.9-5.1L4.5 9.5l5.2-.8z" /></svg>
  ),
  Bolt: (p) => (
    <svg {...base} {...p}><path d="M13 3L4 14h6l-1 7 9-11h-6z" /></svg>
  ),
  Shield: (p) => (
    <svg {...base} {...p}><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
  Phone: (p) => (
    <svg {...base} {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L17 13l5 2v3a2 2 0 01-2 2A16 16 0 014 6a2 2 0 011-2z" /></svg>
  ),
  Mail: (p) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
  ),
  ArrowRight: (p) => (
    <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  Logout: (p) => (
    <svg {...base} {...p}><path d="M15 12H4M4 12l4-4M4 12l4 4M9 4h7a2 2 0 012 2v12a2 2 0 01-2 2H9" /></svg>
  ),
  Inbox: (p) => (
    <svg {...base} {...p}><path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z" /></svg>
  ),
  Plus: (p) => (
    <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
  ),
  Alert: (p) => (
    <svg {...base} {...p}><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>
  ),
  Pencil: (p) => (
    <svg {...base} {...p}><path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 3 21l.5-4.5z" /></svg>
  ),
  Refresh: (p) => (
    <svg {...base} {...p}><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.5 9A9 9 0 005.2 5.2M3.5 15A9 9 0 0018.8 18.8" /></svg>
  ),
  Bookmark: (p) => (
    <svg {...base} {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
  ),
  Eye: (p) => (
    <svg {...base} {...p}><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  EyeOff: (p) => (
    <svg {...base} {...p}><path d="M17.9 17.9A10.5 10.5 0 0112 19C5 19 1 12 1 12a18.5 18.5 0 015.1-5.9M9.9 4.2A9.8 9.8 0 0112 4c7 0 11 8 11 8a18.6 18.6 0 01-2.2 3.2" /><path d="M1 1l22 22" /></svg>
  ),
  Upload: (p) => (
    <svg {...base} {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
  ),
  Trash: (p) => (
    <svg {...base} {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
  ),
  Document: (p) => (
    <svg {...base} {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
  ),
  Camera: (p) => (
    <svg {...base} {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
  ),
};

export default Icon;
