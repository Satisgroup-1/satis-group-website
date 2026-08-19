import Link from "next/link";

/**
 * The standing "back to the control room" control shown at the top of every
 * admin section page. Rendered only for signed-in admins — the signed-out
 * state of each page is a sign-in form, where /admin leads nowhere useful.
 */
export function AdminHomeLink() {
  return (
    <div className="mb-8">
      <Link
        href="/admin"
        className="group inline-flex items-center gap-3 border border-border px-5 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        <span
          aria-hidden="true"
          className="text-accent transition-transform duration-300 group-hover:-translate-x-1"
        >
          ←
        </span>
        Admin home
      </Link>
    </div>
  );
}
