import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Send } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Coffee", href: "/shop" },
    { label: "Subscriptions", href: "/shop" },
    { label: "Brewing Gear", href: "/shop" },
    { label: "Gifts", href: "/shop" },
  ],
  learn: [
    { label: "Our Story", href: "/#story" },
    { label: "Blog", href: "/blog" },
    { label: "Brewing Guides", href: "/blog" },
    { label: "Visit Us", href: "/#story" },
  ],
  support: [
    { label: "Contact", href: "#" },
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 md:py-20 text-[#E78A22]" role="contentinfo">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link 
              to="/"
              className="text-2xl font-display tracking-[0.2em] text-[#E78A22] uppercase block mb-4 hover:opacity-80 transition-opacity"
            >
              TOMOCA
            </Link>
            <p className="text-[#E78A22]/80 text-sm max-w-sm mb-6">
              Ethiopian heritage coffee, crafted with excellence since 1953.
              From Addis Ababa to your cup.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {[
                { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/tomoca_coffee/" },
                { Icon: Twitter, label: "Twitter", href: "#" },
                { Icon: Facebook, label: "Facebook", href: "https://web.facebook.com/CaffeTomoca/?_rdc=1&_rdr#" },
                { Icon: Send, label: "Telegram", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-[#E78A22] hover:bg-secondary transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-sm font-medium text-[#E78A22] uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#E78A22]/70 hover:text-[#E78A22] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn links */}
          <div>
            <h3 className="text-sm font-medium text-[#E78A22] uppercase tracking-wider mb-4">
              Learn
            </h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#E78A22]/70 hover:text-[#E78A22] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="text-sm font-medium text-[#E78A22] uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#E78A22]/70 hover:text-[#E78A22] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#E78A22]/60">
            © {new Date().getFullYear()} TOMOCA Coffee. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-[#E78A22]/60 hover:text-[#E78A22] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-[#E78A22]/60 hover:text-[#E78A22] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
