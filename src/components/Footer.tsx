import Link from "next/link";
import { Container } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t-4 border-amber-400 mt-24 bg-dusk-700 text-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/atbc-logo-full.png" alt="Ashtown Baptist Church" className="h-14 w-14 rounded-full bg-white" />
              <span className="font-display text-lg text-white">Ashtown Baptist Church</span>
            </div>
            <p className="mt-3 text-sm text-white/70 max-w-sm leading-relaxed">
              A Christ community learning to build life on grace. We gather on Sundays
              and share the Christwork of faith through the week.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-white">Service</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Sundays at 7:00 AM - 9:00 AM</li>
              <li><p>&</p></li>
              <li>Sundays at 10:00 AM - 12:00 PM</li>
              <li>Ashtown</li>
              <li>Kumasi, Ghana</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/sermons" className="hover:text-white">Sermons</Link></li>
              <li><Link href="/events" className="hover:text-white">Events</Link></li>
              <li><Link href="/donate" className="hover:text-white">Donate</Link></li>
              <li><Link href="/prayer" className="hover:text-white">Prayer wall</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 text-xs text-white/50">
          © {new Date().getFullYear()} Ashtown Baptist Church. Built with care.
        </div>
      </Container>
    </footer>
  );
}
