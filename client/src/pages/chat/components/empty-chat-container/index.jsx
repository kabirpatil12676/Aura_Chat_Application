import LottieAnimation from "@/components/common/lottie-animation";

const EmptyChatContainer = () => {
  return (
    <div
      className="flex-1 md:flex flex-col justify-center items-center hidden duration-500 transition-all relative overflow-hidden"
      style={{ background: "var(--aura-bg)" }}
    >
      {/* Background orb */}
      <div
        className="absolute pointer-events-none animate-aura-orb"
        style={{
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-slide-in-up">
        <div className="animate-aura-float">
          <LottieAnimation />
        </div>

        <div className="text-center px-8">
          <h3 className="text-3xl lg:text-4xl font-bold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Welcome to{" "}
            <span className="gradient-text">Aura</span>
          </h3>
          <p className="text-base" style={{ color: "var(--aura-muted)" }}>
            Select a conversation or start a new one to begin chatting.
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex gap-2 mt-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-aura-pulse"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
