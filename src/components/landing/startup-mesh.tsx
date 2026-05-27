export function StartupMesh() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="startup-orb startup-orb-a" />
      <div className="startup-orb startup-orb-b" />
      <div className="startup-orb startup-orb-c" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.99_0.002_265)_0%,oklch(0.97_0.01_265)_50%,oklch(0.99_0.002_265)_100%)]" />
    </div>
  );
}
