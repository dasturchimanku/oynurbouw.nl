import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-brand">404</p>
        <p className="mt-2 text-stone">This admin page does not exist.</p>
        <Link href="/admin" className="btn-primary mt-6">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
