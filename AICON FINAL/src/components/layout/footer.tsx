import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/logo";

const Footer = () => {
  return (
    <footer id="pricing" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-muted-foreground">
              AI-powered intelligent conference management system revolutionizing
              academic research workflows.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-background transition-colors duration-200">
                  Plagiarism Detection
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-background transition-colors duration-200">
                  Grammar Check
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-background transition-colors duration-200">
                  Reviewer Suggestions
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-background transition-colors duration-200">
                  Submission Analytics
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-background transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5" />
                info@aicon.com
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center">
                <MapPin className="mr-3 h-5 w-5" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AICON. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
