import { useState } from "react";
import AuraOrb from "@/components/common/logo/AuraOrb";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin = () => {
    if (!email.length) { toast.error("Email is required."); return false; }
    if (!password.length) { toast.error("Password is required."); return false; }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) { toast.error("Email is required."); return false; }
    if (!password.length) { toast.error("Password is required."); return false; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return false; }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
      }
    } catch (error) { console.log(error); }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      }
    } catch (error) { console.log(error); }
  };

  return (
    <div
      className="h-[100vh] w-[100vw] flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--aura-bg)" }}
    >
      {/* Animated background orbs */}
      <div
        className="absolute animate-aura-orb pointer-events-none"
        style={{
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          top: "-150px", left: "-150px", borderRadius: "50%",
        }}
      />
      <div
        className="absolute animate-aura-orb pointer-events-none"
        style={{
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)",
          bottom: "-100px", right: "-100px", borderRadius: "50%",
          animationDelay: "-6s",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "900px", height: "900px",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />

      {/* Auth card */}
      <div
        className="animate-slide-in-up glass relative z-10 w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(124,58,237,0.25)" }}
      >
        {/* Gradient top bar */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #4f46e5, #a78bfa)" }} />

        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex items-center justify-center mb-4 animate-aura-float">
              <AuraOrb size={80} />
            </div>
            <h1 className="text-3xl font-bold gradient-text" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em" }}>
              Aura
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--aura-muted)" }}>
              Connect beautifully
            </p>
          </div>


          {/* Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <TabsTrigger
                value="login"
                className="w-1/2 rounded-lg text-sm font-medium transition-all duration-300
                  data-[state=active]:text-white data-[state=active]:shadow-sm"
                style={{
                  color: "var(--aura-muted)",
                }}
                onFocus={(e) => {}}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="w-1/2 rounded-lg text-sm font-medium transition-all duration-300
                  data-[state=active]:text-white data-[state=active]:shadow-sm"
                style={{ color: "var(--aura-muted)" }}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login" className="flex flex-col gap-4">
              <Input
                id="login-email"
                placeholder="Email address"
                type="email"
                className="aura-input h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Input
                id="login-password"
                placeholder="Password"
                type="password"
                className="aura-input h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button id="login-btn" className="aura-btn h-12 w-full mt-2" onClick={handleLogin}>
                Sign In
              </Button>
            </TabsContent>

            {/* Sign Up */}
            <TabsContent value="signup" className="flex flex-col gap-4">
              <Input
                id="signup-email"
                placeholder="Email address"
                type="email"
                className="aura-input h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="signup-password"
                placeholder="Password"
                type="password"
                className="aura-input h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="signup-confirm-password"
                placeholder="Confirm Password"
                type="password"
                className="aura-input h-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button id="signup-btn" className="aura-btn h-12 w-full mt-2" onClick={handleSignup}>
                Create Account
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs mt-6" style={{ color: "var(--aura-muted)" }}>
            By continuing, you agree to Aura&apos;s Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
