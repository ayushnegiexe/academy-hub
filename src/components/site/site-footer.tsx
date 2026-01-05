import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/devsheel-logo-light.png";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-crimson-deep text-white border-t border-white/5">
      <div className="absolute inset-0 bg-hero-gradient opacity-40 -z-10" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <img src={logo} alt="Devsheel" className="h-14 w-auto brightness-110" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60 font-medium">
            Devsheel Football Academy trains U10, U12, U15 and U18 age groups with an honest focus
            on professional fundamentals.
          </p>
          <div className="mt-8 flex gap-3">
            {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-gold hover:text-ink hover:-translate-y-1"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">Explore</p>
          <ul className="mt-6 space-y-4 text-sm font-bold text-white/50">
            <li>
              <Link to={"/about" as any} className="hover:text-white transition-colors">
                Academy
              </Link>
            </li>
            <li>
              <Link to={"/programs" as any} className="hover:text-white transition-colors">
                Programs
              </Link>
            </li>
            <li>
              <Link to={"/contact" as any} className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">Visit Us</p>
          <ul className="mt-6 space-y-5 text-sm text-white/60 font-medium">
            <li className="flex gap-4">
              <MapPin className="h-5 w-5 shrink-0 text-gold" /> 42 Kingsway Sports Complex
            </li>
            <li className="flex gap-4">
              <Phone className="h-5 w-5 shrink-0 text-gold" /> +44 20 7946 0123
            </li>
            <li className="flex gap-4">
              <Mail className="h-5 w-5 shrink-0 text-gold" /> hello@devsheel.fc
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-[10px] font-bold uppercase tracking-widest text-white/30 md:px-6">
          <p>© {new Date().getFullYear()} Devsheel Football Academy</p>
          <p className="flex gap-4">
            <span>Grassroots</span>
            <span className="h-1 w-1 rounded-full bg-white/20 my-auto" />
            <span>Safeguarding</span>
            <span className="h-1 w-1 rounded-full bg-white/20 my-auto" />
            <span>Development</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
