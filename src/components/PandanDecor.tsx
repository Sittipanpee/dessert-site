"use client";

/**
 * Pandan leaf SVG decorations — scattered across the site background.
 * Each leaf is a soft, organic shape with glass-like translucency.
 * Can be customized later by replacing the SVG paths.
 */

function PandanLeaf({
  className,
  style,
  size = 120,
  rotate = 0,
  opacity = 0.07,
  color = "var(--theme-primary)",
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  rotate?: number;
  opacity?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 2.2}
      viewBox="0 0 100 220"
      fill="none"
      className={className}
      style={{
        position: "absolute",
        pointerEvents: "none",
        transform: `rotate(${rotate}deg)`,
        opacity,
        ...style,
      }}
    >
      {/* Main leaf blade */}
      <path
        d="M50 10 C20 50, 10 100, 15 160 C18 180, 30 200, 50 210 C70 200, 82 180, 85 160 C90 100, 80 50, 50 10Z"
        fill={color}
      />
      {/* Center vein */}
      <path
        d="M50 30 C45 80, 42 130, 50 200"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Side veins */}
      <path
        d="M50 60 C38 70, 28 85, 22 100"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M50 60 C62 70, 72 85, 78 100"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M50 100 C40 110, 30 125, 24 140"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M50 100 C60 110, 70 125, 76 140"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        fill="none"
      />
      {/* Glass highlight overlay */}
      <path
        d="M50 10 C35 50, 28 90, 30 140 C32 160, 40 185, 50 195 C42 170, 38 130, 42 80 C44 55, 48 30, 50 10Z"
        fill="rgba(255,255,255,0.15)"
      />
    </svg>
  );
}

/**
 * Full-page decorative layer. Place this inside a relative-positioned section.
 * Uses z-0 so content sits above it.
 */
export function PandanBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Top-left cluster */}
      <PandanLeaf
        size={140}
        rotate={-25}
        opacity={0.05}
        style={{ top: "5%", left: "-2%" }}
        color="var(--theme-primary)"
      />
      <PandanLeaf
        size={80}
        rotate={15}
        opacity={0.04}
        style={{ top: "8%", left: "8%" }}
        color="var(--theme-primary-light)"
      />

      {/* Top-right */}
      <PandanLeaf
        size={100}
        rotate={35}
        opacity={0.045}
        style={{ top: "2%", right: "3%" }}
        color="var(--theme-accent)"
      />

      {/* Mid-left */}
      <PandanLeaf
        size={110}
        rotate={-40}
        opacity={0.04}
        style={{ top: "30%", left: "-3%" }}
        color="var(--theme-primary-light)"
      />

      {/* Mid-right */}
      <PandanLeaf
        size={90}
        rotate={50}
        opacity={0.05}
        style={{ top: "45%", right: "-1%" }}
        color="var(--theme-primary)"
      />
      <PandanLeaf
        size={60}
        rotate={20}
        opacity={0.035}
        style={{ top: "50%", right: "10%" }}
        color="var(--theme-accent)"
      />

      {/* Bottom-left */}
      <PandanLeaf
        size={120}
        rotate={-15}
        opacity={0.045}
        style={{ top: "65%", left: "2%" }}
        color="var(--theme-primary)"
      />

      {/* Bottom-right */}
      <PandanLeaf
        size={95}
        rotate={40}
        opacity={0.04}
        style={{ top: "80%", right: "5%" }}
        color="var(--theme-primary-light)"
      />

      {/* Very bottom scattered */}
      <PandanLeaf
        size={70}
        rotate={-55}
        opacity={0.035}
        style={{ bottom: "5%", left: "20%" }}
        color="var(--theme-accent)"
      />
      <PandanLeaf
        size={85}
        rotate={25}
        opacity={0.04}
        style={{ bottom: "2%", right: "25%" }}
        color="var(--theme-primary)"
      />
    </div>
  );
}

/**
 * Section-level decorative leaves — use inside a section with position: relative.
 * Lighter and more subtle than the full background version.
 */
export function PandanAccent({
  position = "left",
}: {
  position?: "left" | "right" | "both";
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {(position === "left" || position === "both") && (
        <>
          <PandanLeaf
            size={100}
            rotate={-20}
            opacity={0.06}
            style={{ top: "10%", left: "-2%" }}
            color="var(--theme-primary)"
          />
          <PandanLeaf
            size={60}
            rotate={15}
            opacity={0.04}
            style={{ bottom: "15%", left: "3%" }}
            color="var(--theme-primary-light)"
          />
        </>
      )}
      {(position === "right" || position === "both") && (
        <>
          <PandanLeaf
            size={90}
            rotate={30}
            opacity={0.05}
            style={{ top: "5%", right: "0%" }}
            color="var(--theme-accent)"
          />
          <PandanLeaf
            size={70}
            rotate={-10}
            opacity={0.04}
            style={{ bottom: "10%", right: "5%" }}
            color="var(--theme-primary)"
          />
        </>
      )}
    </div>
  );
}
