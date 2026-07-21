"use client";

import Link from "next/link";
import type { King } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

interface Props {
  kings: King[];
  dynastyName: string;
  color: string;
}

const NODE_W = 140;
const NODE_H = 56;
const COL_GAP = 24;
const ROW_GAP = 40;
const COLS = 4;

export default function DynastyTree({ kings, dynastyName, color }: Props) {
  const { lang } = useLang();

  // Sort by reign_start, layout in a grid (left-to-right, top-to-bottom)
  const sorted = [...kings].sort((a, b) => a.reign_start - b.reign_start);
  const cols = Math.min(COLS, sorted.length);
  const rows = Math.ceil(sorted.length / cols);
  const svgW = cols * NODE_W + (cols - 1) * COL_GAP + 24;
  const svgH = rows * NODE_H + (rows - 1) * ROW_GAP + 24;

  // Node center position
  const pos = (i: number) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: 12 + col * (NODE_W + COL_GAP) + NODE_W / 2,
      y: 12 + row * (NODE_H + ROW_GAP) + NODE_H / 2,
    };
  };

  return (
    <div className="overflow-x-auto">
      <svg width={svgW} height={svgH} className="block mx-auto">
        {/* Connector lines between successive rulers */}
        {sorted.map((_, i) => {
          if (i === sorted.length - 1) return null;
          const from = pos(i);
          const to = pos(i + 1);
          const sameRow = Math.floor(i / cols) === Math.floor((i + 1) / cols);

          if (sameRow) {
            // Horizontal line
            return (
              <line
                key={`line-${i}`}
                x1={from.x + NODE_W / 2}
                y1={from.y}
                x2={to.x - NODE_W / 2}
                y2={to.y}
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.4}
                strokeDasharray="4 3"
              />
            );
          } else {
            // Row wrap: go right edge → down → left edge of next row first node
            const rowEndX = from.x + NODE_W / 2 + 8;
            const nextRowY = to.y - NODE_H / 2 - ROW_GAP / 2;
            const nextStartX = to.x - NODE_W / 2;
            return (
              <polyline
                key={`line-${i}`}
                points={`${from.x + NODE_W / 2},${from.y} ${rowEndX},${from.y} ${rowEndX},${nextRowY} ${nextStartX - 8},${nextRowY} ${nextStartX - 8},${to.y} ${nextStartX},${to.y}`}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.4}
                strokeDasharray="4 3"
              />
            );
          }
        })}

        {/* King nodes */}
        {sorted.map((king, i) => {
          const { x, y } = pos(i);
          const name = lang === "hy" && king.name_hy ? king.name_hy : king.name;
          const start = fmt(king.reign_start, lang);
          const end = king.reign_end != null ? fmt(king.reign_end, lang) : "?";
          const left = x - NODE_W / 2;
          const top = y - NODE_H / 2;

          return (
            <g key={king.id}>
              {/* Node background */}
              <rect
                x={left}
                y={top}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill="#1c1917"
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
              {/* Color accent bar at top */}
              <rect
                x={left}
                y={top}
                width={NODE_W}
                height={3}
                rx={8}
                fill={color}
                fillOpacity={0.8}
              />
              {/* Order number */}
              <text
                x={left + 7}
                y={top + 14}
                fill={color}
                fontSize={9}
                fontWeight="700"
                fontFamily="monospace"
              >
                {i + 1}
              </text>
              {/* Name */}
              <foreignObject x={left + 4} y={top + 8} width={NODE_W - 8} height={NODE_H - 18}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#e7e5e4",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    paddingLeft: 12,
                  }}
                >
                  {name}
                </div>
              </foreignObject>
              {/* Dates */}
              <text
                x={x}
                y={top + NODE_H - 6}
                textAnchor="middle"
                fill="#78716c"
                fontSize={9}
                fontFamily="monospace"
              >
                {start} – {end}
              </text>
              {/* Clickable overlay */}
              <Link href={`/kings/${king.id}`}>
                <rect
                  x={left}
                  y={top}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill="transparent"
                  className="cursor-pointer hover:fill-white/5"
                />
              </Link>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
