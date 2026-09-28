import { redirect } from "next/navigation";

// Removed: requests are no longer collected on the website. This folder can be deleted.
export default function Removed() {
  redirect("/admin");
}
