import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - FontPreview',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <nav className="border-b border-zinc-800 px-6 py-4">
        <Link href="/" className="text-lg font-bold text-white">
          Font<span className="text-violet-400">Preview</span>
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-zinc-500 mb-12">Last updated: March 27, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using FontPreview (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, do not use the Service. We reserve the right to modify these terms
              at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              FontPreview is a web-based font preview and management tool that detects fonts installed on your
              device, allows you to preview them with custom text, compare fonts, create brand kits, generate
              shareable preview links, and export font previews. The Service is provided on a freemium model
              with optional paid subscription plans.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. User Accounts</h2>
            <p className="mb-2">
              You must create an account to access certain features of the Service. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete registration information</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Subscription and Payments</h2>
            <p className="mb-2">
              FontPreview offers free and paid subscription plans. For paid plans:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li>You may cancel your subscription at any time; access continues until the end of the billing period</li>
              <li>Refunds are handled on a case-by-case basis at our discretion</li>
              <li>We reserve the right to change pricing with 30 days notice to existing subscribers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Acceptable Use</h2>
            <p className="mb-2">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Service</li>
              <li>Copy, reproduce, modify, or create derivative works based on the Service or its design</li>
              <li>Scrape, crawl, or use automated means to access the Service or extract data</li>
              <li>Resell, sublicense, or redistribute the Service or any part thereof</li>
              <li>Use the Service to infringe on the intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to the Service, other accounts, or related systems</li>
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Upload malicious files or content that could harm the Service or other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Intellectual Property</h2>
            <p className="mb-2">
              The Service, including its design, layout, code, features, algorithms, branding, and all related
              intellectual property, is owned by FontPreview and protected by copyright, trademark, and other
              intellectual property laws.
            </p>
            <p className="mb-2">
              You retain ownership of any content you create using the Service (brand kits, shared collections, etc.).
              By using the Service, you grant us a limited license to store and display your content solely for
              the purpose of providing the Service to you.
            </p>
            <p>
              The fonts detected on your device remain the property of their respective owners. FontPreview does
              not claim ownership of any fonts and does not upload, store, or redistribute your font files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Font Data and Privacy</h2>
            <p>
              FontPreview detects fonts installed on your device using browser APIs. Your font files are never
              uploaded to our servers. Font detection happens entirely within your browser. We do not collect,
              store, or share information about which fonts are installed on your device. See our{' '}
              <Link href="/privacy" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link>{' '}
              for more details on how we handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express
              or implied, including but not limited to implied warranties of merchantability, fitness for a
              particular purpose, and non-infringement. We do not guarantee that the Service will be uninterrupted,
              error-free, or that all fonts on your device will be detected.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, FontPreview shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
              directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting
              from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account and access to the Service at any time,
              with or without cause, with or without notice. Upon termination, your right to use the Service
              will immediately cease. All provisions of these Terms that by their nature should survive termination
              shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to its conflict of law provisions. Any disputes arising from these Terms or the
              Service shall be resolved in the courts of the United States.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{' '}
              <span className="text-violet-400">support@fontpreview.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
