import React, { useMemo } from "react";
import "./project-chart.scss";

export default function ApprovalDonut({ data }: {
  data: Record<string, number>
}) {
  const entries = Object.entries(data)

  const total = useMemo(
    () => entries.reduce((sum, [, value]) => sum + value, 0),
    [entries]
  );

  const firstKey = entries[0]?.[0] ?? "";
  const firstValue = entries[0]?.[1] ?? 0;
  const firstPercent = useMemo(
    () => total ? (firstValue / total) * 100 : 0,
    [total, firstValue]
  );

  return (
    <div className="donut-container">
      <svg viewBox="0 0 36 36" className="donut">
        <circle
          className="donut-ring"
          cx="18"
          cy="18"
          r="15.9155"
          fill="transparent"
          strokeWidth="3"
        />
        <circle
          className="donut-segment approved"
          cx="18"
          cy="18"
          r="15.9155"
          fill="transparent"
          strokeWidth="3"
          strokeDasharray={`${firstPercent} ${100 - firstPercent}`}
          strokeDashoffset="25"
        />
      </svg>
      <div className="donut-center">
        {firstPercent.toFixed(0)}%
      </div>
      <div className="legend">
        {entries.map(([key]) => (
          <span key={key} className={`legend-item ${key.toLowerCase()}`}>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}
