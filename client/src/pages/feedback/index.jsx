import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Star } from "lucide-react";
import apiClient from "@/lib/api-client";
import { SUBMIT_FEEDBACK_ROUTE } from "@/lib/constants";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import AuraOrb from "@/components/common/logo/AuraOrb";

const Feedback = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating."); return; }
    if (!feedbackText.trim()) { toast.error("Please enter your feedback."); return; }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post(
        SUBMIT_FEEDBACK_ROUTE,
        { rating, feedback: feedbackText },
        { withCredentials: true }
      );
      if (response.status === 201) {
        toast.success("Thank you for your feedback!");
        setRating(0);
        setFeedbackText("");
        setTimeout(() => navigate("/chat"), 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <div
      className="min-h-[100vh] flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "var(--aura-bg)" }}
    >
      {/* Background orb */}
      <div
        className="absolute pointer-events-none animate-aura-orb"
        style={{
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "-100px", right: "-100px",
        }}
      />
      <div
        className="absolute pointer-events-none animate-aura-orb"
        style={{
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "-80px", left: "-80px",
          animationDelay: "-5s",
        }}
      />

      {/* Feedback card */}
      <div
        className="relative z-10 glass w-full max-w-md rounded-2xl overflow-hidden animate-slide-in-up"
        style={{ border: "1px solid rgba(124,58,237,0.2)" }}
      >
        {/* Gradient top accent */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #4f46e5, #a78bfa)" }} />

        <div className="p-8">
          {/* Header row */}
          <div className="flex items-center gap-4 mb-7">
            <button
              id="feedback-back-btn"
              onClick={() => navigate("/chat")}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--aura-text)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; e.currentTarget.style.color = "#a78bfa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--aura-text)"; }}
            >
              <ArrowLeft size={17} />
            </button>

            <div className="flex items-center gap-3">
              <AuraOrb size={36} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--aura-text)", fontFamily: "'Inter', sans-serif" }}>
                  Share Feedback
                </h2>
                <p className="text-xs" style={{ color: "var(--aura-muted)" }}>Help us improve Aura</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Star rating */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--aura-muted)" }}>
                Rate your experience
              </label>
              <div
                className="flex items-center justify-center gap-3 py-5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hoveredRating || rating);
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all duration-150 hover:scale-125"
                      style={{
                        fontSize: "28px",
                        color: isActive ? "#fbbf24" : "rgba(255,255,255,0.15)",
                        filter: isActive ? "drop-shadow(0 0 8px rgba(251,191,36,0.6))" : "none",
                      }}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="text-center text-sm font-medium" style={{ color: "#fbbf24" }}>
                  {ratingLabels[hoveredRating || rating]}
                </p>
              )}
            </div>

            {/* Text feedback */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--aura-muted)" }}>
                Tell us more
              </label>
              <textarea
                id="feedback-text"
                className="w-full rounded-xl p-4 text-sm resize-none transition-all duration-200 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--aura-text)",
                  minHeight: "120px",
                }}
                placeholder="What do you like? What could be better?"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(124,58,237,0.7)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit button */}
            <button
              id="submit-feedback-btn"
              type="submit"
              disabled={isSubmitting}
              className="aura-btn h-12 w-full rounded-xl flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={15} />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
