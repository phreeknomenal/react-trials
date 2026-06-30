import { Phone, Mail } from "lucide-react";

export const borderedCard = "border border-zinc-200 dark:border-zinc-700 rounded-lg";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">{children}</div>;
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function Badge({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        muted
          ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
      }`}
    >
      {label}
    </span>
  );
}

export function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

export function Disclosure({ title, body }: { title: string; body: string }) {
  return (
    <details className={`${borderedCard} group`}>
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg list-none">
        {title}
        <span aria-hidden="true" className="ml-2 transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="px-4 pb-4 pt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
        {body}
      </div>
    </details>
  );
}

export function ContactCard({
  name,
  role,
  phone,
  email,
  affiliation,
}: {
  name: string | null;
  role: string | null;
  phone?: string | null;
  email?: string | null;
  affiliation?: string | null;
}) {
  return (
    <Card>
      {name && <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{name}</p>}
      {role && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{role}</p>}
      {affiliation && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{affiliation}</p>
      )}
      {(phone || email) && (
        <div className="mt-2 space-y-0.5">
          {phone && <p className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400"><Phone className="h-3 w-3 shrink-0" />{phone}</p>}
          {email && <p className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400"><Mail className="h-3 w-3 shrink-0" />{email}</p>}
        </div>
      )}
    </Card>
  );
}
