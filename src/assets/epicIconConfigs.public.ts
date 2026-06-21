import advanceCareerIcon from "./epic-icons/advance-career.svg";
import defaultEpicIcon from "./epic-icons/default.svg";
import financialStabilityIcon from "./epic-icons/financial-stability.svg";
import findLifePartnerIcon from "./epic-icons/find-life-partner.svg";
import healthEnergyIcon from "./epic-icons/health-energy.svg";

/**
 * Pixel-art epic icons inside the 96×96 white tile (contain-fit, 10px inset).
 */
export type EpicIconConfig = { kind: "fill"; src: string };

/** The tile size (px) clip dimensions were measured against in Figma (legacy). */
export const BASE_TILE_SIZE = 24;

export const DEFAULT_EPIC_ICON: EpicIconConfig = {
  kind: "fill",
  src: defaultEpicIcon,
};

/** Public demo — Jules/tutorial epics and generic fallbacks only. */
export const EPIC_ICON_CONFIGS: Record<string, EpicIconConfig> = {
  "Advance My Career": { kind: "fill", src: advanceCareerIcon },
  "Financial Stability": { kind: "fill", src: financialStabilityIcon },
  "Health & Energy": { kind: "fill", src: healthEnergyIcon },
  "Step Into Leadership": { kind: "fill", src: advanceCareerIcon },
  "Get Promoted": { kind: "fill", src: advanceCareerIcon },
  "Build Real Security": { kind: "fill", src: financialStabilityIcon },
  "Keep Making Music": { kind: "fill", src: defaultEpicIcon },
  "Keep Shooting": { kind: "fill", src: defaultEpicIcon },
  "Feel Like Myself Again": { kind: "fill", src: healthEnergyIcon },
  "Find My Person": { kind: "fill", src: findLifePartnerIcon },
  "Find a Creative Community": { kind: "fill", src: defaultEpicIcon },
};

export function epicIconConfigFor(name: string): EpicIconConfig {
  return EPIC_ICON_CONFIGS[name] ?? DEFAULT_EPIC_ICON;
}

export function epicIconSrcFor(name: string): string {
  return epicIconConfigFor(name).src;
}
