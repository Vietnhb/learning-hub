"use client";

import React from "react";
import type { Connection } from "../data";

type Props = {
  connections: Connection[];
};

const EnergyBeams = ({ connections }: Props) => {
  if (connections.length === 0) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full overflow-visible">
      <defs>
        <filter id="neon-glow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {connections.map((c, i) => (
          <linearGradient
            key={`grad-${i}`}
            id={`beam-grad-${i}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor={c.color} stopOpacity="1" />
            <stop offset="100%" stopColor={c.color} stopOpacity="0.15" />
          </linearGradient>
        ))}
      </defs>

      {connections.map((c, i) => {
        const my = (c.y1 + c.y2) / 2;
        const pathD = `M ${c.x1} ${c.y1} C ${c.x1} ${my - 50}, ${c.x2} ${my + 50}, ${c.x2} ${c.y2}`;

        return (
          <g key={`beam-${i}`}>
            <path
              d={pathD}
              stroke={c.color}
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
              opacity={0.12}
              filter="url(#neon-glow)"
            />

            <path
              d={pathD}
              stroke={`url(#beam-grad-${i})`}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              opacity={0.85}
            />

            <path
              d={pathD}
              stroke="#ffffff"
              strokeWidth={1.5}
              strokeLinecap="round"
              fill="none"
              opacity={0.85}
              className="animate-dash"
            />

            {[0.22, 0.52, 0.8].map((begin, particleIndex) => (
              <circle key={`particle-${particleIndex}`} r={particleIndex === 1 ? 3 : 2.2} fill="#ffffff">
                <animateMotion
                  dur={`${1.7 + particleIndex * 0.28}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                  path={pathD}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0.15;0"
                  dur={`${1.7 + particleIndex * 0.28}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export default React.memo(EnergyBeams);