
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="h-8 w-8" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-medium">GadgetHub</span>
            </Link>
            <p className="text-sm text-neutral-500">
              Get your tech essentials delivered fast!
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-neutral-400 transition-colors hover:text-neutral-900"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-neutral-400 transition-colors hover:text-neutral-900"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-neutral-400 transition-colors hover:text-neutral-900"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company Info</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-neutral-500 transition-colors hover:text-neutral-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-neutral-500 transition-colors hover:text-neutral-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-neutral-500 transition-colors hover:text-neutral-900">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-neutral-500 transition-colors hover:text-neutral-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-neutral-500 transition-colors hover:text-neutral-900">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-neutral-500 transition-colors hover:text-neutral-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Have questions?</h3>
            <p className="text-sm text-neutral-500 mb-2">
              Our tech experts are available
            </p>
            <a 
              href="tel:+11234567890" 
              className="mb-2 flex items-center text-base font-medium"
            >
              (+123) 000 111 222 333
            </a>
            <a 
              href="mailto:support@gadgethub.com" 
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              support@gadgethub.com
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6">
          <p className="text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} GadgetHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
