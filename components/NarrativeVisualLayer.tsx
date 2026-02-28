"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  SECTION_VISUALS,
  VISUAL_ASSETS,
  VISUAL_MOTION,
  type SectionVisualTarget,
  type VisualImageAssetKey,
} from "@/lib/tokens";

interface NarrativeVisualLayerProps {
  sectionId: SectionVisualTarget;
  opacity: number;
  className?: string;
  compact?: boolean;
  assetOverride?: VisualImageAssetKey;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export default function NarrativeVisualLayer({
  sectionId,
  opacity,
  className,
  compact = false,
  assetOverride,
}: NarrativeVisualLayerProps) {
  const reduceMotion = useReducedMotion();
  const config = SECTION_VISUALS[sectionId];
  if (config.variant === "none") return null;

  const assetKey = assetOverride ?? config.assetKey;
  const asset = assetKey ? VISUAL_ASSETS[assetKey] : null;
  const combinedOpacity = clamp01(opacity * config.opacity);

  const floatAnimation = reduceMotion
    ? undefined
    : { y: [-VISUAL_MOTION.floatDistance, VISUAL_MOTION.floatDistance, -VISUAL_MOTION.floatDistance] };
  const floatTransition = reduceMotion
    ? undefined
    : { duration: VISUAL_MOTION.floatDuration, ease: "easeInOut", repeat: Infinity };

  return (
    <motion.div
      className={`narrative-visual-layer ${className ?? ""}`}
      style={{ opacity: combinedOpacity, mixBlendMode: config.blendMode }}
      animate={floatAnimation}
      transition={floatTransition}
    >
      {asset ? (
        <Image
          src={asset}
          alt=""
          fill
          sizes={compact ? "128px" : "50vw"}
          className={`narrative-visual-image ${compact ? "narrative-visual-image-compact" : ""}`}
        />
      ) : null}

      {config.variant === "holo-data" ? (
        <>
          <div className="holo-grid" />
          <div className="holo-rings" />
          <div className="holo-scanline" />
        </>
      ) : (
        <>
          <div className="scan-overlay" />
          <div className="hud-ring" />
          <div className="scan-sweep" style={{ animationDuration: `${VISUAL_MOTION.scanDuration}s` }} />
        </>
      )}
    </motion.div>
  );
}
