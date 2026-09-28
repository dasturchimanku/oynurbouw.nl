"use client";

import { useMemo, useState } from "react";
import { Calculator, Minus, Plus } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";
import { whatsappHref } from "@/lib/site";

type Item = { id: string; name: string; price: number; unit: string };

export type CalcLabels = {
  title: string;
  choose: string;
  amount: string;
  estimate: string;
  from: string;
  disclaimer: string;
  send: string;
  message: string; // template with {service} {item} {amount} {unit} {total}
};

export function PriceCalculator({
  items,
  whatsapp,
  service,
  labels,
  locale,
}: {
  items: Item[];
  whatsapp: string;
  service: string;
  labels: CalcLabels;
  locale: string;
}) {
  const [id, setId] = useState(items[0]?.id ?? "");
  const [amount, setAmount] = useState(20);
  const item = items.find((i) => i.id === id) ?? items[0];
  const isArea = /m²|m2/.test(item?.unit ?? "");
  const step = isArea ? 5 : 1;

  const fmt = useMemo(
    () => new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [locale],
  );
  if (!item) return null;
  const total = Math.max(0, amount) * item.price;
  const unitShort = item.unit.replace(/^(per|pro)\s+/i, "");

  const msg = labels.message
    .replace("{service}", service.toLowerCase())
    .replace("{item}", item.name)
    .replace("{amount}", String(amount))
    .replace("{unit}", unitShort)
    .replace("{total}", fmt.format(total));

  return (
    <div className="rounded-[1.5rem] bg-ink p-5 text-white sm:p-7">
      <div className="flex items-center gap-2 text-sm font-semibold text-brand">
        <Calculator className="size-4" /> {labels.title}
      </div>

      <label htmlFor="calc-item" className="mt-5 block text-sm text-white/70">
        {labels.choose}
      </label>
      <select
        id="calc-item"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
          const next = items.find((i) => i.id === e.target.value);
          setAmount(/m²|m2/.test(next?.unit ?? "") ? 20 : 1);
        }}
        className="mt-1.5 h-12 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-base text-white outline-none focus:border-brand"
      >
        {items.map((i) => (
          <option key={i.id} value={i.id} className="text-ink">
            {i.name}
          </option>
        ))}
      </select>

      <label htmlFor="calc-amount" className="mt-4 block text-sm text-white/70">
        {labels.amount} ({unitShort})
      </label>
      <div className="mt-1.5 flex h-12 items-center rounded-xl border border-white/15 bg-white/5">
        <button type="button" onClick={() => setAmount((a) => Math.max(0, a - step))} className="grid h-full w-12 place-items-center text-white/80 hover:text-white" aria-label="−">
          <Minus className="size-4" />
        </button>
        <input
          id="calc-amount"
          type="number"
          inputMode="numeric"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Math.min(99999, Number(e.target.value) || 0)))}
          className="h-full min-w-0 flex-1 bg-transparent text-center text-lg font-semibold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" onClick={() => setAmount((a) => a + step)} className="grid h-full w-12 place-items-center text-white/80 hover:text-white" aria-label="+">
          <Plus className="size-4" />
        </button>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-5">
        <span className="text-sm text-white/70">{labels.estimate}</span>
        <span className="text-right">
          <span className="block text-xs text-white/60">{labels.from}</span>
          <span className="font-display text-4xl font-extrabold tabular-nums" aria-live="polite">
            {fmt.format(total)}
          </span>
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/50">{labels.disclaimer}</p>

      <a
        href={whatsappHref(whatsapp, msg)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex h-13 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-base font-semibold text-white transition hover:bg-[#1ebe5b]"
      >
        <SocialIcon name="whatsapp" className="size-5" /> {labels.send}
      </a>
    </div>
  );
}
