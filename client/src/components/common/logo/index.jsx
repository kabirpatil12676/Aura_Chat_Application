import AuraOrb from "./AuraOrb";

const Logo = () => {
  return (
    <div className="flex px-5 py-4 justify-start items-center gap-3">
      <AuraOrb size={36} />
      <span
        className="text-2xl font-bold tracking-tight gradient-text select-none"
        style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
      >
        Aura
      </span>
    </div>
  );
};

export default Logo;
