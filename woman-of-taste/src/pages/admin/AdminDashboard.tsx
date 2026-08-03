import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAdminAuth, adminFetch } from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import {
  Users, Mail, CalendarCheck, BookOpen, Clock, ArrowRight, PlusCircle, Send, Eye,
  RotateCcw, CheckCircle2, Sparkles,
} from "lucide-react";
import RandIcon from "../../components/RandIcon";
import { useIsMobile } from "../../hooks/use-mobile";

interface Stats {
  totalContacts: number; emailsThisMonth: number; activeBookings: number;
  outstandingPayments: number; totalPosts: number; optedOutContacts: number;
  latestBooking: { firstName: string; surname: string; eventTitle: string; eventDate: string } | null;
}
interface Activity { id: number; actionType: string; description: string; createdAt: string; }

interface PendingBooking { id: number; firstName: string; surname: string; eventTitle: string; totalAmount: number; createdAt: string; }
interface PendingRefund { id: number; firstName: string; surname: string; eventTitle: string; totalAmount: number; submittedAt: string | null; }
interface BlogDraft { id: number; title: string; category: string; updatedAt: string; }
interface PendingContent { id: number; weekOf: string; blogTopic: string | null; emailTopic: string | null; seoKeyword: string | null; }
interface RecentMessage { id: number; firstName: string; lastName: string; email: string; notes: string | null; createdAt: string; }

interface DashboardData {
  actionItems: {
    pendingBookings: { count: number; items: PendingBooking[] };
    pendingRefunds: { count: number; items: PendingRefund[] };
    blogDrafts: { count: number; items: BlogDraft[] };
    pendingContent: { count: number; items: PendingContent[] };
    recentMessages: { items: RecentMessage[] };
  };
  charts: {
    bookingsTrend: { date: string; bookings: number; revenue: number }[];
    statusBreakdown: { status: string; count: number }[];
  };
}

const STATUS_COLOR: Record<string, { bg: string; label: string }> = {
  PENDING: { bg: "#f59e0b", label: "Pending" },
  APPROVED: { bg: "#3b82f6", label: "Approved" },
  PAID: { bg: "#10b981", label: "Paid" },
  OVERDUE: { bg: "#ef4444", label: "Overdue" },
  DECLINED: { bg: "#9ca3af", label: "Declined" },
  WAITLIST: { bg: "#8b5cf6", label: "Waitlist" },
};

function fmtZAR(v: number) {
  return `R ${Number(v).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function fmtShortDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: "1rem 1.1rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14, border: "1px solid #eee" }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: "0.75rem", color: "#777", marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

function ActionType({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string }> = {
    email_sent: { label: "Email", color: "#3b82f6" },
    blog_post_published: { label: "Blog", color: "#8b5cf6" },
    blog_post_created: { label: "Blog Draft", color: "#a78bfa" },
    contact_added: { label: "Contact", color: "#10b981" },
    contacts_imported: { label: "Import", color: "#059669" },
    blog_post_deleted: { label: "Archive", color: "#f59e0b" },
    default: { label: "Action", color: "#6b7280" },
  };
  const m = map[type] ?? map.default;
  return <span style={{ background: m.color + "22", color: m.color, fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>{m.label}</span>;
}

// ── Action item card — a titled list with a count badge and a "view all" link ──
function ActionCard({
  icon, color, title, count, href, empty, children,
}: {
  icon: React.ReactNode; color: string; title: string; count: number; href: string; empty: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #eee", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "0.9rem 1.1rem", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f2f2f2" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ flex: 1, fontSize: "0.85rem", fontWeight: 700, color: "#1a1a2e" }}>{title}</span>
        {count > 0 && (
          <span style={{ background: color, color: "white", fontSize: "0.72rem", fontWeight: 700, borderRadius: 99, padding: "1px 8px", minWidth: 20, textAlign: "center" }}>
            {count}
          </span>
        )}
      </div>
      <div style={{ flex: 1, padding: count > 0 ? "0.4rem 0" : "1.1rem", minHeight: 40 }}>
        {count > 0 ? children : (
          <div style={{ fontSize: "0.78rem", color: "#bbb", display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={14} color="#c8e6d0" /> {empty}
          </div>
        )}
      </div>
      {count > 0 && (
        <Link href={href}>
          <div style={{ padding: "0.6rem 1.1rem", borderTop: "1px solid #f2f2f2", fontSize: "0.74rem", fontWeight: 600, color: color, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            View all <ArrowRight size={11} />
          </div>
        </Link>
      )}
    </div>
  );
}

function ActionRow({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ padding: "0.45rem 1.1rem", display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontSize: "0.8rem", color: "#333", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      <span style={{ fontSize: "0.7rem", color: "#999" }}>{sub}</span>
    </div>
  );
}

// ── Bookings trend — single-series bar chart, last 30 days ──────────────────
function BookingsTrendChart({ data }: { data: { date: string; bookings: number; revenue: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 100, H = 30; // viewBox units; scales responsively
  const max = Math.max(1, ...data.map(d => d.bookings));
  const barW = W / data.length;
  const barColor = "hsl(225,50%,35%)";

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H + 6}`} width="100%" height={140} preserveAspectRatio="none" style={{ overflow: "visible" }}>
        {data.map((d, i) => {
          const h = (d.bookings / max) * H;
          const x = i * barW;
          return (
            <rect
              key={d.date}
              x={x + barW * 0.18}
              y={H - h}
              width={barW * 0.64}
              height={Math.max(h, d.bookings > 0 ? 0.6 : 0)}
              rx={barW * 0.18}
              fill={hover === i ? "hsl(38,45%,55%)" : barColor}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", transition: "fill 0.15s" }}
            />
          );
        })}
        <line x1={0} y1={H} x2={W} y2={H} stroke="#eee" strokeWidth={0.3} />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "#aaa", marginTop: 4, fontFamily: "Raleway, sans-serif" }}>
        <span>{fmtShortDate(data[0]?.date)}</span>
        <span>{fmtShortDate(data[data.length - 1]?.date)}</span>
      </div>
      {hover !== null && data[hover] && (
        <div style={{
          position: "absolute", top: 0, left: `${(hover / data.length) * 100}%`, transform: "translateX(-50%)",
          background: "hsl(225,50%,18%)", color: "white", borderRadius: 8, padding: "0.4rem 0.6rem",
          fontSize: "0.7rem", fontFamily: "Raleway, sans-serif", whiteSpace: "nowrap", pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 2,
        }}>
          <div style={{ fontWeight: 700 }}>{new Date(data[hover].date).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}</div>
          <div>{data[hover].bookings} booking{data[hover].bookings !== 1 ? "s" : ""} · {fmtZAR(data[hover].revenue)}</div>
        </div>
      )}
    </div>
  );
}

// ── Booking status breakdown — horizontal bars using the app's status colors ──
function StatusBreakdownChart({ data }: { data: { status: string; count: number }[] }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...sorted.map(d => d.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
      {sorted.map(d => {
        const meta = STATUS_COLOR[d.status] ?? { bg: "#9ca3af", label: d.status };
        return (
          <div key={d.status} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 70, fontSize: "0.72rem", color: "#666", fontFamily: "Raleway, sans-serif", flexShrink: 0 }}>{meta.label}</span>
            <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 6, height: 14, overflow: "hidden" }}>
              <div style={{ width: `${(d.count / max) * 100}%`, background: meta.bg, height: "100%", borderRadius: 6, transition: "width 0.4s" }} />
            </div>
            <span style={{ width: 26, textAlign: "right", fontSize: "0.75rem", fontWeight: 700, color: "#333", flexShrink: 0 }}>{d.count}</span>
          </div>
        );
      })}
      {sorted.every(d => d.count === 0) && (
        <div style={{ fontSize: "0.78rem", color: "#bbb", padding: "0.5rem 0" }}>No bookings yet.</div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    Promise.all([adminFetch("/admin/stats"), adminFetch("/admin/activity"), adminFetch("/admin/dashboard")])
      .then(async ([sr, ar, dr]) => {
        const sd = await sr.json(); const ad = await ar.json(); const dd = await dr.json();
        if (sd.ok) setStats(sd.stats);
        if (ad.ok) setActivity(ad.activity);
        if (dd.ok) setDashboard(dd);
      }).finally(() => setLoading(false));
  }, []);

  function fmtDate(d: string) {
    return new Date(d).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  const STAT_CARDS = stats ? [
    { icon: <Users size={20} />, label: "Total Contacts", value: stats.totalContacts, color: "#3b82f6", sub: `${stats.optedOutContacts} opted out` },
    { icon: <Mail size={20} />, label: "Emails Sent This Month", value: stats.emailsThisMonth, color: "#8b5cf6" },
    { icon: <CalendarCheck size={20} />, label: "Active Bookings", value: stats.activeBookings, color: "#f59e0b" },
    { icon: <RandIcon size={20} />, label: "Outstanding Payments", value: stats.outstandingPayments, color: "#ef4444" },
    { icon: <BookOpen size={20} />, label: "Blog Posts Published", value: stats.totalPosts, color: "#10b981" },
    { icon: <Clock size={20} />, label: "Latest Booking", value: stats.latestBooking ? stats.latestBooking.firstName : "—", color: "#6b7280", sub: stats.latestBooking ? `${stats.latestBooking.eventTitle}` : undefined },
  ] : [];

  const QUICK_ACTIONS = [
    { label: "Compose Email", icon: <Send size={18} />, href: "/admin/email/compose", color: "#3b82f6" },
    { label: "New Blog Post", icon: <PlusCircle size={18} />, href: "/admin/blog/new", color: "#8b5cf6" },
    { label: "View Contacts", icon: <Users size={18} />, href: "/admin/contacts", color: "#10b981" },
    { label: "View Bookings", icon: <Eye size={18} />, href: "/admin/bookings", color: "#f59e0b" },
  ];

  const ai = dashboard?.actionItems;
  const totalUrgent = ai
    ? ai.pendingBookings.count + ai.pendingRefunds.count + ai.blogDrafts.count + ai.pendingContent.count
    : 0;

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading dashboard…</div>
      ) : (
        <>
          {/* Needs Your Attention */}
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "#333", marginBottom: "0.65rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              Needs Your Attention
              {totalUrgent > 0 && (
                <span style={{ background: "#ef4444", color: "white", fontSize: "0.68rem", fontWeight: 700, borderRadius: 99, padding: "1px 9px" }}>
                  {totalUrgent}
                </span>
              )}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              <ActionCard icon={<CalendarCheck size={15} />} color="#f59e0b" title="Bookings to Approve" count={ai?.pendingBookings.count ?? 0} href="/admin/bookings" empty="No pending bookings">
                {ai?.pendingBookings.items.map(b => (
                  <ActionRow key={b.id} title={`${b.firstName} ${b.surname} · ${fmtZAR(b.totalAmount)}`} sub={b.eventTitle} />
                ))}
              </ActionCard>

              <ActionCard icon={<RotateCcw size={15} />} color="#ef4444" title="Refunds to Process" count={ai?.pendingRefunds.count ?? 0} href="/admin/refunds" empty="No refunds waiting">
                {ai?.pendingRefunds.items.map(r => (
                  <ActionRow key={r.id} title={`${r.firstName} ${r.surname} · ${fmtZAR(r.totalAmount)}`} sub={r.eventTitle} />
                ))}
              </ActionCard>

              <ActionCard icon={<BookOpen size={15} />} color="#8b5cf6" title="Blog Drafts" count={ai?.blogDrafts.count ?? 0} href="/admin/blog" empty="No drafts waiting">
                {ai?.blogDrafts.items.map(p => (
                  <ActionRow key={p.id} title={p.title} sub={p.category} />
                ))}
              </ActionCard>

              <ActionCard icon={<Sparkles size={15} />} color="#0d9488" title="Content & SEO Approvals" count={ai?.pendingContent.count ?? 0} href="/admin/content-engine/pipeline" empty="Nothing pending approval">
                {ai?.pendingContent.items.map(c => (
                  <ActionRow key={c.id} title={c.blogTopic ?? c.emailTopic ?? c.seoKeyword ?? "Content suggestion"} sub={`Week of ${c.weekOf}`} />
                ))}
              </ActionCard>

              <ActionCard icon={<Mail size={15} />} color="#3b82f6" title="Recent Contact Messages" count={ai?.recentMessages.items.length ?? 0} href="/admin/contacts" empty="No new messages">
                {ai?.recentMessages.items.map(m => (
                  <ActionRow key={m.id} title={`${m.firstName} ${m.lastName}`} sub={m.notes?.replace(/^Subject:\s*/, "") || m.email} />
                ))}
              </ActionCard>
            </div>
          </section>

          {/* Charts */}
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "#333", marginBottom: "0.65rem", fontWeight: 600 }}>Trends</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: "0.75rem" }}>
              <div style={{ background: "white", borderRadius: 12, padding: "1.1rem 1.2rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333", marginBottom: "0.5rem" }}>Bookings — Last 30 Days</div>
                {dashboard && <BookingsTrendChart data={dashboard.charts.bookingsTrend} />}
              </div>
              <div style={{ background: "white", borderRadius: 12, padding: "1.1rem 1.2rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333", marginBottom: "0.65rem" }}>Booking Status</div>
                {dashboard && <StatusBreakdownChart data={dashboard.charts.statusBreakdown} />}
              </div>
            </div>
          </section>

          {/* Stats row */}
          <section style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "#333", marginBottom: "0.65rem", fontWeight: 600 }}>Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.65rem" }}>
              {STAT_CARDS.map((s, i) => <StatCard key={i} {...s} />)}
            </div>
          </section>

          {/* Quick actions */}
          <section style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "#333", marginBottom: "0.65rem", fontWeight: 600 }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.65rem" }}>
              {QUICK_ACTIONS.map(a => (
                <Link key={a.href} href={a.href}>
                  <div style={{ background: "white", borderRadius: 12, padding: isMobile ? "1rem 0.85rem" : "1.25rem 1rem", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#333" }}>{a.label}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: "#aaa", flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Activity feed */}
          <section>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "#333", marginBottom: "0.65rem", fontWeight: 600 }}>Recent Activity</h2>
            <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #eee", overflow: "hidden" }}>
              {activity.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#aaa", fontSize: "0.85rem" }}>No activity logged yet.</div>
              ) : (
                activity.map((a, i) => (
                  <div key={a.id} style={{ padding: "0.85rem 1rem", borderBottom: i < activity.length - 1 ? "1px solid #f0f0f5" : "none", display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <ActionType type={a.actionType} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.4 }}>{a.description}</div>
                      <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: 2 }}>{fmtDate(a.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}
