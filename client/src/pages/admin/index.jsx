import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { HOST } from "@/lib/constants";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import {
  Users, MessageSquare, Hash, Star, BarChart2,
  ArrowLeft, RefreshCw, CheckCircle2, XCircle,
  TrendingUp, Shield,
} from "lucide-react";
import AuraOrb from "@/components/common/logo/AuraOrb";

/* ─── Color palette ─── */
const C = {
  purple: "#7c3aed",
  indigo: "#4f46e5",
  blue:   "#3b82f6",
  cyan:   "#06b6d4",
  green:  "#10b981",
  pink:   "#ec4899",
  amber:  "#f59e0b",
};
const PIE_COLORS = [C.purple, C.pink];
const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#0f1120",
  border: "1px solid rgba(124,58,237,0.3)",
  borderRadius: "10px",
  color: "#e8e9f0",
  fontSize: "13px",
};

/* ─── Tab config ─── */
const TABS = [
  { id: "dashboard", label: "Dashboard",  icon: BarChart2 },
  { id: "users",     label: "Users",      icon: Users },
  { id: "groups",    label: "Groups",     icon: Hash },
  { id: "feedbacks", label: "Feedbacks",  icon: Star },
  { id: "reports",   label: "Reports",    icon: TrendingUp },
];

/* ─── Stat card ─── */
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div
    className="relative flex flex-col gap-3 p-6 rounded-2xl overflow-hidden transition-all duration-300 group"
    style={{
      background: "rgba(15,17,32,0.7)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = `${color}55`;
      e.currentTarget.style.boxShadow = `0 0 30px ${color}18`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    {/* Background glow */}
    <div
      className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none transition-opacity duration-300"
      style={{ background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`, transform: "translate(30%, -30%)" }}
    />
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}22`, border: `1px solid ${color}44` }}
    >
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <p className="text-sm" style={{ color: "var(--aura-muted)" }}>{label}</p>
      <p className="text-4xl font-black mt-0.5" style={{ color, fontFamily: "'Inter', sans-serif" }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--aura-muted)" }}>{sub}</p>}
    </div>
  </div>
);

/* ─── Table wrapper ─── */
const TableCard = ({ title, icon: Icon, color = C.purple, children }) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ background: "rgba(15,17,32,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}
  >
    <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
        <Icon size={15} style={{ color }} />
      </div>
      <h2 className="text-base font-semibold" style={{ color: "var(--aura-text)" }}>{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

/* ─── Chart card ─── */
const ChartCard = ({ title, children }) => (
  <div
    className="rounded-2xl p-6"
    style={{ background: "rgba(15,17,32,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}
  >
    <h3 className="text-sm font-semibold mb-5 uppercase tracking-wider" style={{ color: "var(--aura-muted)" }}>{title}</h3>
    {children}
  </div>
);

/* ─── Main component ─── */
const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ users: 0, messages: 0, channels: 0 });
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async () => {
    setRefreshing(true);
    try {
      const [s, u, c, f] = await Promise.all([
        apiClient.get(`${HOST}/api/admin/stats`, { withCredentials: true }),
        apiClient.get(`${HOST}/api/admin/users`, { withCredentials: true }),
        apiClient.get(`${HOST}/api/admin/channels`, { withCredentials: true }),
        apiClient.get(`${HOST}/api/admin/feedbacks`, { withCredentials: true }),
      ]);
      if (s.data.stats)       setStats(s.data.stats);
      if (u.data.users)       setUsers(u.data.users);
      if (c.data.channels)    setChannels(c.data.channels);
      if (f.data.feedbacks)   setFeedbacks(f.data.feedbacks);
    } catch (e) {
      toast.error("Failed to load some data.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* Chart datasets */
  const barData = [
    { name: "Users",    count: stats.users,    fill: C.purple },
    { name: "Messages", count: stats.messages, fill: C.blue },
    { name: "Groups",   count: stats.channels, fill: C.green },
  ];
  const pieData = [
    { name: "Complete", value: users.filter((u) => u.profileSetup).length },
    { name: "Pending",  value: users.filter((u) => !u.profileSetup).length },
  ];
  const areaData = barData;

  /* Average feedback rating */
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-[100vh] w-full flex flex-col" style={{ background: "var(--aura-bg)", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top bar ── */}
      <header
        className="flex items-center justify-between px-8 py-4 sticky top-0 z-20 glass-dark"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}
      >
        <div className="flex items-center gap-3">
          <AuraOrb size={32} />
          <div>
            <h1 className="text-base font-bold" style={{ color: "var(--aura-text)" }}>Aura Admin</h1>
            <p className="text-xs" style={{ color: "var(--aura-muted)" }}>Control Panel</p>
          </div>
          <div
            className="ml-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}
          >
            <Shield size={10} />
            Admin
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="refresh-btn"
            onClick={fetchAll}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--aura-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.color = "#a78bfa"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--aura-muted)"; }}
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            id="back-to-chat-btn"
            onClick={() => navigate("/chat")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--aura-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--aura-muted)"; }}
          >
            <ArrowLeft size={13} />
            Back to Chat
          </button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <nav className="flex items-center gap-1 px-8 pt-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              id={`tab-${id}-btn`}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium relative transition-all duration-200 rounded-t-lg"
              style={{
                color: active ? "#a78bfa" : "var(--aura-muted)",
                background: active ? "rgba(124,58,237,0.08)" : "transparent",
                borderBottom: active ? "2px solid #7c3aed" : "2px solid transparent",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* ── Content ── */}
      <main className="flex-1 p-8">

        {/* ── Dashboard tab ── */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-6 animate-slide-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatCard label="Total Users"    value={stats.users}    icon={Users}         color={C.purple} sub="Registered accounts" />
              <StatCard label="Total Messages" value={stats.messages} icon={MessageSquare}  color={C.blue}   sub="All-time messages" />
              <StatCard label="Total Groups"   value={stats.channels} icon={Hash}           color={C.green}  sub="Active channels" />
            </div>

            {/* Secondary stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatCard
                label="Avg. Feedback Rating"
                value={avgRating}
                icon={Star}
                color={C.amber}
                sub={`From ${feedbacks.length} responses`}
              />
              <StatCard
                label="Profiles Complete"
                value={users.filter((u) => u.profileSetup).length}
                icon={CheckCircle2}
                color={C.cyan}
                sub={`${users.length ? Math.round((users.filter(u=>u.profileSetup).length/users.length)*100) : 0}% completion rate`}
              />
              <StatCard
                label="Pending Setup"
                value={users.filter((u) => !u.profileSetup).length}
                icon={XCircle}
                color={C.pink}
                sub="Profiles not configured"
              />
            </div>
          </div>
        )}

        {/* ── Users tab ── */}
        {activeTab === "users" && (
          <div className="animate-slide-in-up">
            <TableCard title="Registered Users" icon={Users} color={C.purple}>
              {/* Header */}
              <div
                className="grid gap-4 px-4 py-2.5 mb-2 rounded-lg text-xs font-semibold uppercase tracking-wider"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 100px", color: "var(--aura-muted)", background: "rgba(255,255,255,0.03)" }}
              >
                <span>Email</span>
                <span>First Name</span>
                <span>Last Name</span>
                <span>Profile</span>
              </div>
              {/* Rows */}
              <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto scrollbar-hidden">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="grid gap-4 px-4 py-3 rounded-xl items-center transition-all duration-150"
                    style={{ gridTemplateColumns: "2fr 1fr 1fr 100px", border: "1px solid transparent" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.06)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                  >
                    <span className="text-sm truncate" style={{ color: "var(--aura-text)" }}>{u.email}</span>
                    <span className="text-sm" style={{ color: "var(--aura-muted)" }}>{u.firstName || "—"}</span>
                    <span className="text-sm" style={{ color: "var(--aura-muted)" }}>{u.lastName || "—"}</span>
                    <span>
                      {u.profileSetup ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
                          <CheckCircle2 size={10} /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                          <XCircle size={10} /> Pending
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: "var(--aura-muted)" }}>No users found.</p>
                )}
              </div>
            </TableCard>
          </div>
        )}

        {/* ── Groups tab ── */}
        {activeTab === "groups" && (
          <div className="animate-slide-in-up">
            <TableCard title="Channels & Groups" icon={Hash} color={C.green}>
              <div
                className="grid gap-4 px-4 py-2.5 mb-2 rounded-lg text-xs font-semibold uppercase tracking-wider"
                style={{ gridTemplateColumns: "2fr 2fr 120px", color: "var(--aura-muted)", background: "rgba(255,255,255,0.03)" }}
              >
                <span>Channel Name</span>
                <span>Admin</span>
                <span>Members</span>
              </div>
              <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto scrollbar-hidden">
                {channels.map((c) => (
                  <div
                    key={c._id}
                    className="grid gap-4 px-4 py-3 rounded-xl items-center transition-all duration-150"
                    style={{ gridTemplateColumns: "2fr 2fr 120px", border: "1px solid transparent" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.05)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(16,185,129,0.15)", color: C.green }}
                      >#</div>
                      <span className="text-sm font-medium" style={{ color: "var(--aura-text)" }}>{c.name}</span>
                    </div>
                    <span className="text-sm" style={{ color: "var(--aura-muted)" }}>
                      {c.admin ? `${c.admin.firstName} ${c.admin.lastName}` : "Unknown"}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium w-fit"
                      style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", color: C.cyan }}
                    >
                      <Users size={10} /> {c.members?.length || 0}
                    </span>
                  </div>
                ))}
                {channels.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: "var(--aura-muted)" }}>No groups found.</p>
                )}
              </div>
            </TableCard>
          </div>
        )}

        {/* ── Feedbacks tab ── */}
        {activeTab === "feedbacks" && (
          <div className="animate-slide-in-up">
            <TableCard title="User Feedbacks" icon={Star} color={C.amber}>
              <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto scrollbar-hidden">
                {feedbacks.map((f, i) => (
                  <div
                    key={f._id}
                    className="flex items-start gap-4 p-4 rounded-xl transition-all duration-150"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"; e.currentTarget.style.background = "rgba(245,158,11,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    {/* Rating badge */}
                    <div className="flex-shrink-0 text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                        style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}
                      >
                        <span className="text-lg" style={{ color: C.amber }}>★</span>
                        <span className="text-xs font-bold" style={{ color: C.amber }}>{f.rating}/5</span>
                      </div>
                    </div>
                    {/* Stars row */}
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-0.5 mb-2">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} style={{ color: s <= f.rating ? C.amber : "rgba(255,255,255,0.1)", fontSize: "12px" }}>★</span>
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--aura-text)" }}>{f.feedback}</p>
                    </div>
                  </div>
                ))}
                {feedbacks.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: "var(--aura-muted)" }}>No feedback submitted yet.</p>
                )}
              </div>
            </TableCard>
          </div>
        )}

        {/* ── Reports tab ── */}
        {activeTab === "reports" && (
          <div className="flex flex-col gap-6 animate-slide-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar chart */}
              <ChartCard title="Platform Overview">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                      <YAxis stroke="#6b7280" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} fillOpacity={0.9} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Area chart */}
              <ChartCard title="Engagement Volume">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                      <YAxis stroke="#6b7280" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                      <Area type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGrad)" dot={{ fill: "#7c3aed", strokeWidth: 0, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Pie chart */}
              <ChartCard title="Profile Completion Rate">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%" cy="50%"
                        innerRadius={75} outerRadius={105}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.9} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Quick stats */}
              <ChartCard title="Quick Summary">
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Users",    value: stats.users,    max: Math.max(stats.users, 1),    color: C.purple },
                    { label: "Messages", value: stats.messages, max: Math.max(stats.messages, 1), color: C.blue },
                    { label: "Groups",   value: stats.channels, max: Math.max(stats.channels, 1), color: C.green },
                    { label: "Feedbacks",value: feedbacks.length,max: Math.max(feedbacks.length,1),color: C.amber },
                  ].map(({ label, value, max, color }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "var(--aura-muted)" }}>{label}</span>
                        <span style={{ color }}>{value}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.round((value / max) * 100)}%`, background: color, opacity: 0.85 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>
        )}
      </main>

      {/* Bottom bar */}
      <footer
        className="px-8 py-3 flex items-center justify-between text-xs"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--aura-muted)" }}
      >
        <span>Aura Admin Panel · Degree Major Project</span>
        <span>{new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
      </footer>
    </div>
  );
};

export default AdminPanel;
