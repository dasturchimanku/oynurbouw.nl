export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const brand = {
  name: "Oynur Bouw B.V.",
  shortName: "Oynur Bouw",
  color: "#FC5000",
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Dutch numbers → international format, e.g. "085 333 2537" → "+31853332537". */
export function intlPhone(phone: string) {
  let d = phone.replace(/[^\d+]/g, "");
  if (d.startsWith("00")) d = "+" + d.slice(2);
  else if (d.startsWith("0")) d = "+31" + d.slice(1);
  return d;
}

export function telHref(phone: string) {
  return `tel:${intlPhone(phone)}`;
}

export function whatsappHref(num: string, text?: string) {
  let digits = num.replace(/[^\d]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = "31" + digits.slice(1);
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
