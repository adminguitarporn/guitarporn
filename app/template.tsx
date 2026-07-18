/**
 * Page transition — every route change fades + blurs in (450ms, luxury ease).
 * Next.js remounts templates on navigation, which re-triggers the animation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
