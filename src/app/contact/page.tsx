import { Container } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact · Ashtown Baptist Church" };

export default function ContactPage() {
  return (
    <Container className="py-16">
      <div className="grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <p className="text-amber-500 mb-3 font-medium">Get in touch</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight">Contact us</h1>
          <div className="prose-body mt-6 text-ink/80">
            <p>
              Have a question, or want to know more about the church? Send us a
              message and someone will get back to you.
            </p>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-sage">Where</dt>
              <dd className="text-ink">Ashtown, Kumasi, Ghana</dd>
            </div>
            <div>
              <dt className="text-sage">Sunday worship</dt>
              <dd className="text-ink">10:00 AM</dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
