import type { ReactNode } from "react";

export function PageHeader({ title, text, actions }: { title: string; text?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-stone">{text}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
