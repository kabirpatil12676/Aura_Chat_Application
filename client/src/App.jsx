import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Profile from "@/pages/profile";
import Chat from "@/pages/chat";
import Auth from "@/pages/auth";
import Feedback from "@/pages/feedback";
import AdminPanel from "@/pages/admin/index";
import AdminLogin from "@/pages/admin/login";
import apiClient from "@/lib/api-client";
import { GET_USERINFO_ROUTE } from "@/lib/constants";
import { useAppStore } from "@/store";
import AuraOrb from "@/components/common/logo/AuraOrb";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const AdminRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAdmin = userInfo?.email === "admin1234@gmail.com";
  return isAdmin ? children : <Navigate to="/chat" />;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USERINFO_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <div
        className="h-[100vh] w-[100vw] flex items-center justify-center flex-col gap-4"
        style={{ background: "var(--aura-bg)" }}
      >
        <div className="animate-aura-float">
          <AuraOrb size={56} />
        </div>
        <p className="text-sm animate-aura-pulse"
          style={{ color: "var(--aura-muted)", fontFamily: "'Inter', sans-serif" }}>
          Loading…
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <Feedback />
            </PrivateRoute>
          }
        />
        {/* Admin login — public route, no auth required */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
