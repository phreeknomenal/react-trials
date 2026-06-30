import type { Contact, Official } from "@/lib/types/trial";
import { Section, ContactCard } from "@/components/trials/primitives";

export function ContactsSection({
  contacts,
  officials,
}: {
  contacts: Contact[];
  officials: Official[];
}) {
  return (
    <Section id="contact-information" title="Contact Information">
      {contacts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Study Contacts
          </h3>
          <div className="space-y-3">
            {contacts.map((c, i) => (
              <ContactCard key={c.email ?? c.name ?? i} name={c.name} role={c.role} phone={c.phone} email={c.email} />
            ))}
          </div>
        </div>
      )}
      {officials.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Principal Investigators
          </h3>
          <div className="space-y-3">
            {officials.map((o, i) => (
              <ContactCard key={o.name ?? i} name={o.name} role={o.role} affiliation={o.affiliation} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
