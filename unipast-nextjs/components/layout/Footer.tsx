'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">About UNIPAST</h3>
            <p className="text-slate-400 text-sm">
              Uganda Universities Past Papers Portal provides comprehensive access to past examination papers from 20 leading Ugandan universities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-400 hover:text-makerere-gold transition-colors">Home</Link></li>
              <li><Link href="/papers" className="text-slate-400 hover:text-makerere-gold transition-colors">Browse Papers</Link></li>
              <li><Link href="/colleges" className="text-slate-400 hover:text-makerere-gold transition-colors">Colleges</Link></li>
              <li><Link href="/faq" className="text-slate-400 hover:text-makerere-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-slate-400 hover:text-makerere-gold transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-makerere-gold transition-colors">Contact Us</Link></li>
              <li><a href="mailto:support@unipast.ac.ug" className="text-slate-400 hover:text-makerere-gold transition-colors">Email Support</a></li>
              <li><a href="tel:+256704130457" className="text-slate-400 hover:text-makerere-gold transition-colors">+256 704 130 457</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-slate-400 hover:text-makerere-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-makerere-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-slate-400 hover:text-makerere-gold transition-colors">Cookie Policy</Link></li>
              <li><Link href="/guidelines" className="text-slate-400 hover:text-makerere-gold transition-colors">Content Guidelines</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {currentYear} UNIPAST - Uganda Universities Past Papers Portal. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-makerere-gold transition-colors">
                Twitter
              </a>
              <a href="#" className="text-slate-400 hover:text-makerere-gold transition-colors">
                Facebook
              </a>
              <a href="#" className="text-slate-400 hover:text-makerere-gold transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 pt-8 border-t border-slate-700 flex justify-center space-x-6 text-xs text-slate-400">
          <span>🔒 SSL Encrypted</span>
          <span>✓ Content Protected</span>
          <span>🛡️ Secure Payments</span>
        </div>
      </div>
    </footer>
  );
}
