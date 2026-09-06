import Lightfall from "./Lightfall";

export default function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Lightfall
        colors={["#A6C8FF", "#5227FF", "#FF9FFC"]}
        backgroundColor="#08070D"
        speed={0.35}
        streakCount={2}
        streakWidth={1}
        streakLength={1}
        glow={0.8}
        density={0.5}
        twinkle={0.8}
        zoom={3}
        backgroundGlow={0.35}
        opacity={0.75}
        mouseInteraction
        mouseStrength={0.35}
        mouseRadius={1}
      />
    </div>
  );
}