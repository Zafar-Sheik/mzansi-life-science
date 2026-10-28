"use client";
import { useEffect, useRef, useState } from "react";
import { HeartPulse, RotateCcw } from "lucide-react";
import { solvePuzzle } from "@/lib/progress";
import { cn, shuffle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useToolUse } from "./sim-kit";
import { WidgetFrame } from "./widget-frame";

interface Step { prompt: string; options: { text: string; ok: boolean; why: string }[] }
interface Scenario { id: string; title: string; emoji: string; story: string; steps: Step[]; remember: string }

const SCENARIOS: Scenario[] = [
  {
    id: "collapse", title: "Someone collapses", emoji: "🧍", story: "At the taxi rank a man suddenly falls to the ground and doesn't move.",
    steps: [
      { prompt: "What do you do FIRST?", options: [
        { text: "Check for Danger – traffic, electricity, broken glass – before you go closer", ok: true, why: "D for Danger. You can't help anyone if you get hurt too." },
        { text: "Run to him and pull him up into a sitting position", ok: false, why: "Moving him could injure his neck or spine – and you haven't checked for danger." },
        { text: "Pour water on his face", ok: false, why: "That won't help and he could choke." },
      ] },
      { prompt: "It's safe. What next?", options: [
        { text: "Check for a Response: tap his shoulders and shout 'Can you hear me?'", ok: true, why: "R for Response. If he answers, he is breathing and his heart is beating." },
        { text: "Give him something sweet to eat", ok: false, why: "Never put food or drink into the mouth of someone who isn't fully awake." },
        { text: "Take a video for social media", ok: false, why: "Respect his dignity – and every second counts." },
      ] },
      { prompt: "No response. Now?", options: [
        { text: "Shout for help and phone 10177 (or 112 from a cellphone), with the phone on speaker", ok: true, why: "S for Send for help. Get someone to find an AED (defibrillator) if there is one." },
        { text: "Wait a few minutes to see if he wakes up", ok: false, why: "If his heart has stopped, the brain starts dying within 4–6 minutes." },
        { text: "Leave him and look for his family", ok: false, why: "Stay with him – send someone else." },
      ] },
      { prompt: "Then check the Airway and Breathing. He is NOT breathing normally. What do you do?", options: [
        { text: "Start CPR: push hard and fast in the centre of the chest – 30 compressions, then 2 rescue breaths (or hands-only CPR)", ok: true, why: "C for CPR / Circulation. 100–120 compressions a minute, 5–6 cm deep. Keep going until help arrives." },
        { text: "Put him in the recovery position and leave him", ok: false, why: "The recovery position is only for someone who IS breathing." },
        { text: "Slap his face to wake him up", ok: false, why: "That won't restart his heart." },
      ] },
    ],
    remember: "DRSABC: Danger · Response · Send for help · Airway · Breathing · CPR. If someone is unresponsive but breathing normally, put them in the recovery position.",
  },
  {
    id: "choking", title: "Choking", emoji: "😮", story: "Your little brother (10 years old) is eating and suddenly can't speak, cough or breathe. He is clutching his throat.",
    steps: [
      { prompt: "What do you do first?", options: [
        { text: "Give up to 5 firm back blows between the shoulder blades, with him leaning forward", ok: true, why: "Back blows can push the blockage out." },
        { text: "Give him water to wash it down", ok: false, why: "Water can make the blockage worse – he can't swallow." },
        { text: "Put your fingers in his throat to feel for the food", ok: false, why: "A blind finger sweep can push the object deeper." },
      ] },
      { prompt: "It's still stuck. Next?", options: [
        { text: "Give up to 5 abdominal thrusts: stand behind him, fist above the belly button, pull sharply in and up", ok: true, why: "Abdominal thrusts (the Heimlich manoeuvre) force air up from the lungs to push the object out." },
        { text: "Lie him on his back and press on his chest", ok: false, why: "Not while he is still conscious – do back blows and abdominal thrusts." },
        { text: "Hit him on the head", ok: false, why: "That won't move the blockage." },
      ] },
      { prompt: "Still stuck after 3 rounds. What now?", options: [
        { text: "Call 10177 / 112 and keep alternating 5 back blows and 5 abdominal thrusts. If he becomes unconscious, start CPR", ok: true, why: "Get help fast and don't stop." },
        { text: "Wait for it to go down by itself", ok: false, why: "A total blockage can kill within minutes." },
        { text: "Give him bread to push it down", ok: false, why: "Never give food or drink to someone who is choking." },
      ] },
    ],
    remember: "If they can cough, encourage them to keep coughing. If they can't: 5 back blows, 5 abdominal thrusts, repeat – and call for help. Babies: back blows and chest thrusts, never abdominal thrusts.",
  },
  {
    id: "bleeding", title: "Heavy bleeding", emoji: "🩸", story: "Your friend cuts her arm deeply on broken glass. Blood is flowing fast.",
    steps: [
      { prompt: "Before you touch the wound you should…", options: [
        { text: "Protect yourself from her blood – wear gloves or put your hands in plastic bags", ok: true, why: "Blood can carry HIV and hepatitis B. Always avoid direct contact." },
        { text: "Rinse your hands in her blood to see the wound", ok: false, why: "Never touch someone else's blood with bare hands." },
        { text: "Nothing – just grab the arm", ok: false, why: "Protect yourself first." },
      ] },
      { prompt: "Now…", options: [
        { text: "Press firmly on the wound with a clean cloth and raise the arm above the heart", ok: true, why: "Direct pressure and elevation slow the bleeding." },
        { text: "Pull out the glass sticking in the wound", ok: false, why: "Never remove an embedded object – it may be plugging the bleeding. Press around it." },
        { text: "Wash the wound for 10 minutes first", ok: false, why: "Stop the bleeding first; clean minor wounds later." },
      ] },
      { prompt: "Blood soaks through the cloth. You…", options: [
        { text: "Put another cloth on top and keep pressing; call 10177", ok: true, why: "Don't lift the first cloth – it disturbs the clot." },
        { text: "Remove the cloth and look", ok: false, why: "That breaks the clot that is forming." },
        { text: "Tie a very tight string around the neck of the arm", ok: false, why: "Only trained people should use tourniquets." },
      ] },
    ],
    remember: "Protect yourself · Press firmly · Raise the limb · Don't remove embedded objects · Call 10177 for severe bleeding. Watch for shock: pale, cold, clammy skin.",
  },
  {
    id: "burn", title: "A burn", emoji: "🔥", story: "Boiling water from a kettle spills onto your sister's hand.",
    steps: [
      { prompt: "First…", options: [
        { text: "Cool the burn under cool running water for 20 minutes", ok: true, why: "Cooling stops the heat damaging deeper tissue and eases the pain." },
        { text: "Put butter, toothpaste or oil on it", ok: false, why: "These hold the heat in and can cause infection." },
        { text: "Put ice directly on it", ok: false, why: "Ice can damage the skin even more." },
      ] },
      { prompt: "While cooling…", options: [
        { text: "Gently remove rings and watches before the hand swells", ok: true, why: "Swelling can make them cut off the blood supply." },
        { text: "Pop the blisters", ok: false, why: "Blisters protect the skin from infection – leave them." },
        { text: "Rub the skin to warm it up", ok: false, why: "Never rub a burn." },
      ] },
      { prompt: "After 20 minutes…", options: [
        { text: "Cover loosely with cling wrap or a clean plastic bag and see a clinic if it is large, deep or on the face/hands", ok: true, why: "Cling wrap protects from germs without sticking." },
        { text: "Wrap it tightly with cotton wool", ok: false, why: "Fluffy material sticks to burns." },
        { text: "Leave it open in the dust", ok: false, why: "It can get infected." },
      ] },
    ],
    remember: "Cool (20 minutes running water) · Remove jewellery · Cover with cling wrap · Get help for large, deep, face, hand or genital burns, and for all burns on babies.",
  },
  {
    id: "seizure", title: "A seizure (fit)", emoji: "⚡", story: "A classmate falls down and starts jerking uncontrollably.",
    steps: [
      { prompt: "You should…", options: [
        { text: "Move hard or sharp objects away and cushion their head", ok: true, why: "Protect them from injury." },
        { text: "Hold them down to stop the jerking", ok: false, why: "Restraining them can cause injuries." },
        { text: "Put a spoon in their mouth so they don't swallow their tongue", ok: false, why: "Never put anything in their mouth – it can break teeth or block the airway." },
      ] },
      { prompt: "And…", options: [
        { text: "Time the seizure – call 10177 if it lasts more than 5 minutes or another one starts", ok: true, why: "A long seizure is a medical emergency." },
        { text: "Pour water on them", ok: false, why: "That doesn't help and they could choke." },
        { text: "Leave – it's not your problem", ok: false, why: "Stay with them until they recover." },
      ] },
      { prompt: "The jerking stops and they are drowsy. Now…", options: [
        { text: "Roll them into the recovery position and stay with them, speaking calmly", ok: true, why: "The recovery position keeps the airway open." },
        { text: "Give them something to drink immediately", ok: false, why: "Not until they are fully awake." },
        { text: "Tell everyone to come and watch", ok: false, why: "Give them privacy and space." },
      ] },
    ],
    remember: "Protect, don't restrain · Nothing in the mouth · Time it · Recovery position afterwards. Epilepsy is a condition of the nervous system – it is not contagious and not caused by witchcraft.",
  },
  {
    id: "snake", title: "Snakebite", emoji: "🐍", story: "Your uncle is bitten on the ankle by a snake while working in the field.",
    steps: [
      { prompt: "First…", options: [
        { text: "Get away from the snake, keep him calm and still, and call for help", ok: true, why: "Moving makes venom spread faster through the lymph." },
        { text: "Chase and kill the snake", ok: false, why: "That risks more bites. A photo from a safe distance is enough." },
        { text: "Make him run to the clinic", ok: false, why: "Running spreads the venom faster." },
      ] },
      { prompt: "Next…", options: [
        { text: "Remove tight shoes, rings or watches near the bite and keep the leg still (splint it if you can)", ok: true, why: "Swelling can be severe; keeping the limb still slows the venom." },
        { text: "Cut the bite and suck out the venom", ok: false, why: "This causes infection and doesn't remove venom." },
        { text: "Tie a tight tourniquet above the bite", ok: false, why: "Tourniquets can cause loss of the limb." },
      ] },
      { prompt: "Then…", options: [
        { text: "Get him to hospital as quickly as possible, lying down – antivenom is given there", ok: true, why: "Only a hospital can decide whether antivenom is needed." },
        { text: "Give him alcohol for the pain", ok: false, why: "Alcohol speeds up circulation and complicates treatment." },
        { text: "Wait to see if he gets sick", ok: false, why: "Some venoms act fast. Go now." },
      ] },
    ],
    remember: "Calm · Still · Remove tight items · Immobilise · Hospital. Don't cut, suck, use ice or tourniquets. Most South African snakebites are from non-fatal snakes – but always treat as an emergency.",
  },
];

/**
 * First-aid trainer: six emergencies, one decision at a time, with the reason
 * for every right and wrong choice. Includes a CPR rhythm trainer.
 */
export function FirstAidSim() {
  const touch = useToolUse();
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const s = SCENARIOS.find((x) => x.id === sid)!;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const done = step >= s.steps.length;
  const st = s.steps[step];
  const opts = st ? shuffle(st.options.map((o, i) => ({ ...o, i })), `${sid}-${step}`) : [];
  // CPR metronome
  const [cpr, setCpr] = useState(false);
  const [beats, setBeats] = useState(0);
  const [taps, setTaps] = useState<number[]>([]);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (!cpr) return;
    timer.current = window.setInterval(() => setBeats((b) => b + 1), 545); // ≈110 per minute
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [cpr]);
  const bpm = taps.length > 3 ? Math.round(60000 / ((taps[taps.length - 1] - taps[taps.length - 4]) / 3)) : null;

  const choose = (o: (typeof opts)[number]) => {
    touch();
    setPicked(o.i);
    if (!o.ok) setMistakes((m) => m + 1);
  };
  const next = () => {
    setPicked(null);
    const n = step + 1;
    setStep(n);
    if (n >= s.steps.length && mistakes === 0) solvePuzzle(`first-aid:${sid}`, 15);
  };
  const reset = (id = sid) => { setSid(id); setStep(0); setPicked(null); setMistakes(0); };

  return (
    <WidgetFrame title="First-aid trainer" colour="var(--t-daily)" instruction="Choose what to do at each step. In a real emergency in South Africa, call 10177 (ambulance) or 112 from any cellphone.">
      <div className="flex flex-wrap gap-1.5">
        {SCENARIOS.map((x) => <button key={x.id} onClick={() => reset(x.id)} aria-pressed={x.id === sid} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", x.id === sid ? "border-daily bg-daily text-white" : "border-line text-muted hover:text-fg")}>{x.emoji} {x.title}</button>)}
      </div>
      <p className="mt-3 rounded-xl border-l-4 border-daily bg-daily/5 p-3 text-sm">{s.story}</p>
      {!done ? (
        <div className="mt-3">
          <div className="text-xs font-bold text-muted uppercase">Step {step + 1} of {s.steps.length}</div>
          <p className="mt-1 font-display text-lg font-bold">{st.prompt}</p>
          <div className="mt-2 grid gap-2">
            {opts.map((o) => (
              <button key={o.i} disabled={picked !== null && st.options[picked].ok} onClick={() => choose(o)}
                className={cn("rounded-xl border-2 px-3 py-2 text-left text-sm transition", picked === o.i ? (o.ok ? "border-success bg-success/10" : "border-danger bg-danger/10") : "border-line hover:border-daily/50")}>
                {o.text}
                {picked === o.i && <span className="mt-1 block text-xs">{o.ok ? "✅ " : "❌ "}{o.why}</span>}
              </button>
            ))}
          </div>
          {picked !== null && st.options[picked].ok && <Button size="sm" className="mt-2" onClick={next}>Next step</Button>}
        </div>
      ) : (
        <div role="status" className="mt-3 rounded-2xl border border-success/40 bg-success/10 p-4">
          <p className="font-display text-lg font-bold">{mistakes === 0 ? "🏅 Perfect – you'd make a great first responder!" : `Done, with ${mistakes} wrong choice${mistakes > 1 ? "s" : ""} along the way.`}</p>
          <Button size="sm" variant="secondary" className="mt-2" onClick={() => reset()}><RotateCcw className="h-4 w-4" /> Practise again</Button>
        </div>
      )}
      <Explain colour="var(--t-daily)"><strong>Remember:</strong> {s.remember}</Explain>

      <div className="mt-4 rounded-2xl border border-line p-4">
        <div className="flex flex-wrap items-center gap-2"><HeartPulse className="h-5 w-5 text-danger" /><span className="font-display font-bold">CPR rhythm trainer</span><span className="text-xs text-muted">Compressions must be 100–120 per minute – about the beat of “Stayin’ Alive”.</span></div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button size="sm" variant={cpr ? "secondary" : "primary"} onClick={() => { setCpr((c) => !c); setBeats(0); setTaps([]); }}>{cpr ? "Stop" : "Start the beat"}</Button>
          <button onClick={() => { touch(); setTaps((t) => [...t.slice(-8), performance.now()]); }} className={cn("h-20 w-20 rounded-full border-4 border-danger font-bold text-danger transition active:scale-95", cpr && beats % 2 === 0 && "bg-danger/15")} aria-label="Tap to compress">PUSH</button>
          <div className="text-sm">
            <div>Beat: <strong>{cpr ? (beats % 30) + 1 : "–"}</strong> / 30 then 2 breaths</div>
            <div>Your rate: <strong className={cn(bpm && (bpm < 100 || bpm > 120) ? "text-danger" : "text-success")}>{bpm ? `${bpm} per minute` : "tap PUSH in time"}</strong>{bpm && (bpm < 100 ? " – faster!" : bpm > 120 ? " – slower!" : " – perfect")}</div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">This trainer does not replace a first-aid course. The Red Cross and St John run courses across South Africa. Poison emergencies: Poisons Information Helpline 0861 555 777.</p>
    </WidgetFrame>
  );
}
