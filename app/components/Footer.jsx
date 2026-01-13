"use client"
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-base-300/30 backdrop-blur-xl overflow-hidden">
      
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                HabitFlow
              </span>
            </Link>
            <p className="text-base-content/60 leading-relaxed max-w-sm">
              Build discipline through consistency, not motivation. 
              Track your journey, analyze your growth, and become the best version of yourself.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Platform */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/90">
                Platform
              </h3>
              <div className="flex flex-col gap-3">
                <FooterLink href="/dashboard">Dashboard</FooterLink>
                <FooterLink href="/settings">Settings</FooterLink>
              </div>
            </div>

            {/* Account */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/90">
                Account
              </h3>
              <div className="flex flex-col gap-3">
                <FooterLink href="/login">Login</FooterLink>
                <FooterLink href="/register">Register</FooterLink>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/90">
                Connect
              </h3>
              <div className="flex flex-col gap-3">
                <ExternalLink href="https://github.com/Saurabh-Jagtap">
                  GitHub
                </ExternalLink>
                <ExternalLink href="https://www.linkedin.com/in/saurabh-jagtap-084893287/">
                  LinkedIn
                </ExternalLink>
              </div>
            </div>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-base-content/40">
          <p>© {new Date().getFullYear()} HabitFlow. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

// Helper Component for Internal Links
const FooterLink = ({ href, children }) => (
  <Link 
    href={href} 
    className="text-base-content/60 hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 w-fit"
  >
    {children}
  </Link>
);

// Helper Component for External Links
const ExternalLink = ({ href, children }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-base-content/60 hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 w-fit flex items-center gap-1"
  >
    {children}
    {/* Tiny external link arrow icon */}
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17l9.2-9.2M17 17V7H7"/>
    </svg>
  </a>
);

export default Footer;