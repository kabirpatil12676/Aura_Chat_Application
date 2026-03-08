import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import AuraOrb from "@/components/common/logo/AuraOrb";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setIsAdmin } = useAppStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    // Simulate slight delay for premium UX feel
    await new Promise((r) => setTimeout(r, 600));
    if (username === "admin1234@gmail.com" && password === "password") {
      setIsAdmin(true);
      toast.success("Welcome back, Admin.");
      navigate("/admin");
    } else {
      setIsLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Invalid administrator credentials.");
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-[100vh] w-full flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "var(--aura-bg)" }}
    >
      {/* Background orbs */}
      <div className="absolute pointer-events-none" style={{
        width: "700px", height: "700px",
        background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
        borderRadius: "50%", top: "-200px", left: "-200px",
      }} />
      <div className="absolute pointer-events-none animate-aura-orb" style={{
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)",
        borderRadius: "50%", bottom: "-100px", right: "-100px",
      }} />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Back button */}
      <button
        id="admin-back-btn"
        onClick={() => navigate("/auth")}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-all duration-200"
        style={{ color: "var(--aura-muted)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#a78bfa"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--aura-muted)"}
      >
        <ArrowLeft size={16} />
        Back to App
      </button>

      {/* Login card */}
      <div
        className={`relative z-10 w-full max-w-sm animate-slide-in-up ${shake ? "animate-shake" : ""}`}
        style={{
          background: "rgba(15,17,32,0.8)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: "1.5rem",
          overflow: "hidden",
        }}
      >
        {/* Gradient top accent */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #4f46e5, #a78bfa)" }} />

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-8">
            {/* Shield + Orb composite icon */}
            <div className="relative">
              <AuraOrb size={56} />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "2px solid var(--aura-bg)" }}
              >
                <ShieldCheck size={12} className="text-white" />
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold" style={{ color: "var(--aura-text)", fontFamily: "'Inter', sans-serif" }}>
                Administrator Access
              </h1>
              <p className="text-xs mt-1" style={{ color: "var(--aura-muted)" }}>
                Restricted area · Aura Control Panel
              </p>
            </div>

            {/* Security badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.25)",
                color: "#a78bfa",
              }}
            >
              <ShieldCheck size={11} />
              Secure Login
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Email field */}
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--aura-muted)" }}
              />
              <input
                id="admin-email-input"
                type="text"
                placeholder="Admin email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "var(--aura-text)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(124,58,237,0.7)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.09)";
                  e.target.style.boxShadow = "none";
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--aura-muted)" }}
              />
              <input
                id="admin-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-11 text-sm rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "var(--aura-text)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(124,58,237,0.7)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.09)";
                  e.target.style.boxShadow = "none";
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: "var(--aura-muted)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#a78bfa"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--aura-muted)"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Login button */}
            <button
              id="admin-login-btn"
              onClick={handleLogin}
              disabled={isLoading}
              className="aura-btn h-11 w-full rounded-xl flex items-center justify-center gap-2 text-sm font-semibold mt-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-xs" style={{ color: "var(--aura-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Back to user login */}
          <button
            id="admin-back-auth-btn"
            className="w-full h-10 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--aura-muted)",
            }}
            onClick={() => navigate("/auth")}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(124,58,237,0.1)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
              e.currentTarget.style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "var(--aura-muted)";
            }}
          >
            Back to User Login
          </button>
        </div>

        {/* Bottom security note */}
        <div
          className="px-8 py-3 flex items-center justify-center gap-2 text-xs"
          style={{
            background: "rgba(124,58,237,0.05)",
            borderTop: "1px solid rgba(124,58,237,0.1)",
            color: "var(--aura-muted)",
          }}
        >
          <Lock size={11} />
          This area is restricted to authorized administrators only
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
