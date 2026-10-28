/** A small, theme-aware line/scatter plot for the labs (no chart library needed). */
export interface Curve { points: [number, number][]; colour: string; label?: string; dashed?: boolean }

export function Plot({ curves, xMax, yMax, xLabel, yLabel, marker, xTicks = 5, yTicks = 5, height = 220, title, bars }: {
  curves?: Curve[];
  xMax: number;
  yMax: number;
  xLabel: string;
  yLabel: string;
  marker?: { x: number; y: number; colour?: string };
  xTicks?: number;
  yTicks?: number;
  height?: number;
  title?: string;
  /** Optional bar chart: one bar per category. */
  bars?: { label: string; value: number; colour: string }[];
}) {
  const W = 400;
  const H = height;
  const L = 46;
  const B = 34;
  const T = title ? 22 : 10;
  const Rr = 12;
  const sx = (x: number) => L + (x / xMax) * (W - L - Rr);
  const sy = (y: number) => H - B - (y / yMax) * (H - B - T);
  const fmt = (v: number) => (Math.abs(v) >= 100 || Number.isInteger(v) ? String(Math.round(v)) : v.toFixed(1)).replace(".", ",");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="diagram rounded-xl border border-line bg-bg" role="img" aria-label={`${title ? `${title}. ` : ""}Graph of ${yLabel} against ${xLabel}`}>
      {title && <text x={W / 2} y={15} textAnchor="middle" fontSize={11} fontWeight={700}>{title}</text>}
      <g className="grid">
        {Array.from({ length: yTicks + 1 }, (_, i) => <line key={`y${i}`} x1={L} x2={W - Rr} y1={sy((yMax * i) / yTicks)} y2={sy((yMax * i) / yTicks)} />)}
        {!bars && Array.from({ length: xTicks + 1 }, (_, i) => <line key={`x${i}`} y1={T} y2={H - B} x1={sx((xMax * i) / xTicks)} x2={sx((xMax * i) / xTicks)} />)}
      </g>
      <line className="axis" x1={L} x2={W - Rr} y1={H - B} y2={H - B} />
      <line className="axis" x1={L} x2={L} y1={T} y2={H - B} />
      {Array.from({ length: yTicks + 1 }, (_, i) => <text key={`ty${i}`} className="tick" x={L - 5} y={sy((yMax * i) / yTicks) + 3} textAnchor="end">{fmt((yMax * i) / yTicks)}</text>)}
      {!bars && Array.from({ length: xTicks + 1 }, (_, i) => <text key={`tx${i}`} className="tick" x={sx((xMax * i) / xTicks)} y={H - B + 13} textAnchor="middle">{fmt((xMax * i) / xTicks)}</text>)}
      <text x={(L + W) / 2} y={H - 4} textAnchor="middle" fontSize={11} fontWeight={600}>{xLabel}</text>
      <text x={11} y={(T + H - B) / 2} textAnchor="middle" fontSize={11} fontWeight={600} transform={`rotate(-90 11 ${(T + H - B) / 2})`}>{yLabel}</text>
      {bars?.map((b, i) => {
        const w = (W - L - Rr) / bars.length;
        const x = L + i * w + w * 0.18;
        return (
          <g key={b.label}>
            <rect x={x} y={sy(b.value)} width={w * 0.64} height={H - B - sy(b.value)} fill={b.colour} rx={3} />
            <text className="tick" x={x + w * 0.32} y={H - B + 13} textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      {curves?.map((c, i) => (
        <polyline key={i} className="curve" points={c.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")} stroke={c.colour} strokeDasharray={c.dashed ? "5 4" : undefined} />
      ))}
      {curves?.filter((c) => c.label).map((c, i) => (
        <g key={`l${i}`}>
          <rect x={W - 130} y={T + 4 + i * 15} width={10} height={4} fill={c.colour} />
          <text x={W - 116} y={T + 9 + i * 15} fontSize={10}>{c.label}</text>
        </g>
      ))}
      {marker && <circle cx={sx(marker.x)} cy={sy(marker.y)} r={5} fill={marker.colour ?? "var(--brand)"} stroke="white" strokeWidth={1.5} />}
    </svg>
  );
}
