"use client";
import { useState } from "react";
import { Explain, useToolUse } from "./sim-kit";
import { Plot } from "./plot";
import { Slider, Toggle, WidgetFrame } from "./widget-frame";

const g = (d: number, mu: number, s: number) => Math.exp(-(((d - mu) / s) ** 2));
const FSH = (d: number) => 0.4 + 0.35 * g(d, 3, 4) + 0.5 * g(d, 14, 1.2);
const LH = (d: number) => 0.3 + 2.1 * g(d, 14, 1.1);
const OEST = (d: number, preg: boolean) => 0.3 + 1.1 * g(d, 12.5, 2.5) + (preg && d > 14 ? 0.7 : 0.5 * g(d, 21, 3.5));
const PROG = (d: number, preg: boolean) => (preg && d > 14 ? 0.1 + Math.min(1.7, 1.7 * ((d - 14) / 7)) : 0.1 + 1.6 * g(d, 21, 3.5));
const ENDO = (d: number, preg: boolean) => (d <= 5 ? 1 - (d / 5) * 0.8 : d <= 14 ? 0.2 + ((d - 5) / 9) * 0.5 : preg ? Math.min(1.1, 0.7 + ((d - 14) / 10) * 0.4) : Math.min(1, 0.7 + ((d - 14) / 10) * 0.3));

function phase(d: number, preg: boolean) {
  if (d <= 5) return { name: "Menstruation", text: "Progesterone is low, so the thick endometrium breaks down and is shed with blood through the vagina (a period). FSH from the pituitary starts a new follicle growing in the ovary." };
  if (d < 14) return { name: "Follicular (pre-ovulation) phase", text: "FSH makes a Graafian follicle mature. The follicle secretes oestrogen, which repairs and thickens the endometrium. Rising oestrogen inhibits FSH (negative feedback) and stimulates LH." };
  if (d === 14) return { name: "Ovulation", text: "A surge of LH from the pituitary makes the mature follicle burst and release an ovum (secondary oocyte) into the Fallopian tube. This is the fertile time." };
  if (preg) return { name: "Pregnancy", text: "The ovum was fertilised and the blastocyst implanted. The corpus luteum keeps making progesterone (later the placenta takes over), so the endometrium stays thick and there is no menstruation." };
  return { name: "Luteal (post-ovulation) phase", text: "LH turns the empty follicle into a corpus luteum, which secretes progesterone. Progesterone keeps the endometrium thick and ready for implantation and inhibits FSH and LH. If there is no fertilisation, the corpus luteum breaks down around day 24–28, progesterone drops and menstruation begins." };
}

/**
 * The menstrual cycle on one slider: pituitary hormones (FSH, LH), ovarian
 * hormones (oestrogen, progesterone), what the ovary is doing and the
 * thickness of the endometrium, day by day – with a "pregnant" switch.
 */
export function CycleLab() {
  const touch = useToolUse();
  const [day, setDay] = useState(1);
  const [preg, setPreg] = useState(false);
  const days = Array.from({ length: 57 }, (_, i) => 1 + i / 2);
  const p = phase(day, preg);
  const ovary = day < 14 ? `Follicle growing (${Math.round(((day - 1) / 13) * 100)}% mature)` : day === 14 ? "Ovulation – the follicle bursts" : preg ? "Corpus luteum kept (pregnancy)" : day < 25 ? "Corpus luteum (secretes progesterone)" : "Corpus luteum breaking down";
  const follicleR = day < 14 ? 6 + (day / 14) * 16 : 0;

  return (
    <WidgetFrame title="The menstrual cycle" colour="var(--t-body)" instruction="Drag through the 28 days. Watch the hormones, the ovary and the uterus lining change together.">
      <Slider label={`Day ${day}`} value={day} min={1} max={28} onChange={(v) => { touch(); setDay(v); }} colour="var(--t-body)" format={(v) => `day ${v}`} />
      <div className="mt-2"><Toggle on={preg} onChange={(v) => { touch(); setPreg(v); }}>Fertilisation happened (pregnancy)</Toggle></div>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Plot curves={[
          { points: days.map((d) => [d, FSH(d)] as [number, number]), colour: "#2563eb", label: "FSH (pituitary)" },
          { points: days.map((d) => [d, LH(d)] as [number, number]), colour: "#0891b2", label: "LH (pituitary)" },
          { points: days.map((d) => [d, OEST(d, preg)] as [number, number]), colour: "#db2777", label: "Oestrogen (ovary)" },
          { points: days.map((d) => [d, PROG(d, preg)] as [number, number]), colour: "#f59e0b", label: "Progesterone (ovary)" },
          { points: [[day, 0], [day, 2.6]], colour: "var(--text)", dashed: true },
        ]} xMax={28} xTicks={7} yMax={2.6} xLabel="Day of the cycle" yLabel="Hormone level" height={230} />
        <div className="space-y-3">
          <div className="rounded-xl bg-surface-2 p-3">
            <div className="text-xs font-bold text-muted uppercase">Ovary</div>
            <svg viewBox="0 0 160 70" className="mt-1 h-16 w-full" aria-hidden>
              <ellipse cx={80} cy={35} rx={70} ry={30} fill="#fcd34d" opacity={0.6} />
              {day < 14 && <circle cx={80} cy={35} r={follicleR} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />}
              {day < 14 && <circle cx={80 + follicleR / 3} cy={35} r={3} fill="#db2777" />}
              {day === 14 && <><path d="M80,35l30,-25" stroke="#db2777" strokeWidth={2} /><circle cx={112} cy={9} r={4} fill="#db2777" /></>}
              {day > 14 && <circle cx={80} cy={35} r={preg || day < 25 ? 16 : 10} fill={preg || day < 25 ? "#f59e0b" : "#d6d3d1"} />}
            </svg>
            <div className="text-sm font-semibold">{ovary}</div>
          </div>
          <div className="rounded-xl bg-surface-2 p-3">
            <div className="text-xs font-bold text-muted uppercase">Endometrium (uterus lining)</div>
            <div className="mt-2 h-6 overflow-hidden rounded-md bg-bg"><div className="h-full rounded-md bg-gradient-to-r from-rose-300 to-rose-600 transition-[width] duration-300" style={{ width: `${ENDO(day, preg) * 90}%` }} /></div>
            <div className="mt-1 text-sm font-semibold">{day <= 5 && !preg ? "Being shed (menstruation)" : ENDO(day, preg) > 0.75 ? "Thick, with many blood vessels" : "Thickening"}</div>
          </div>
        </div>
      </div>
      <Explain colour="var(--t-body)"><strong>{p.name}.</strong> {p.text}</Explain>
    </WidgetFrame>
  );
}
