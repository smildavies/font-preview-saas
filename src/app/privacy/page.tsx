import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - FontPreview',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <nav className="border-b border-zinc-800 px-6 py-4">
        <Link href="/" className="text-lg font-bold text-white">
          Font<span className="text-violet-400">Preview</span>
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 mb-12">Last updated: March 27, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              FontPreview (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, and safeguard your information when you use our web-based font
              preview service (&quot;the Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>

            <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">Account Information</h3>
            <p className="mb-3">
              When you create an account, we collect your email address and an encrypted password. If you
              subscribe to a paid plan, payment is processed by Stripe — we do not store your credit card
              information on our servers.
            </p>

            <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">User-Created Content</h3>
            <p className="mb-3">
              We store brand kits, shared collections, and voting data that you create within the Service.
              This data is associated with your account and stored in our database.
            </p>

            <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">Font Data</h3>
            <p className="mb-3 px-4 py-3 bg-violet-600/10 border border-violet-600/20 rounded-lg">
              <strong className="text-violet-400">We do NOT collect, upload, store, or transmit your font files.</strong>{' '}
              Font detection happens entirely within your browser using standard browser APIs. Your fonts
              never leave your device. We have no access to your font files or information about which
              fonts are installed on your computer.
            </p>

            <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2">Usage Data</h3>
            <p>
              We may collect anonymous usage data such as pages visited, features used, and general device
              information (browser type, operating system) to improve the Service. This data cannot be used
              to identify you personally.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>To provide and maintain the Service</li>
              <li>To process subscription payments</li>
              <li>To store your brand kits and shared collections</li>
              <li>To send important service-related communications</li>
              <li>To improve and optimize the Service</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Data Sharing</h2>
            <p className="mb-2">We do NOT sell your personal information. We share data only with:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><strong className="text-zinc-300">Supabase</strong> — our database and authentication provider (stores your account data)</li>
              <li><strong className="text-zinc-300">Stripe</strong> — our payment processor (handles subscription billing)</li>
              <li><strong className="text-zinc-300">Vercel</strong> — our hosting provider (serves the website)</li>
            </ul>
            <p className="mt-2">
              These providers are bound by their own privacy policies and process data only as necessary
              to provide their services to us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Shared Collections</h2>
            <p>
              When you create a shared collection and generate a share link, the font names you selected
              and any votes from viewers are stored in our database. Anyone with the share link can view
              the collection and vote. Share links expire after 30 days. You can delete a shared collection
              at any time from your dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Cookies and Local Storage</h2>
            <p>
              We use essential cookies for authentication (keeping you signed in) and local storage for
              user preferences (such as dismissing the browser compatibility banner). We do not use
              tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your data, including encrypted
              connections (HTTPS), secure authentication, and row-level security on our database.
              However, no method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. If you delete your account,
              we will delete your personal data, brand kits, and shared collections within 30 days.
              Anonymous usage data may be retained indefinitely for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your data (brand kits, collections)</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{' '}
              <span className="text-violet-400">privacy@fontpreview.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed to children under 13. We do not knowingly collect personal
              information from children under 13. If we become aware that we have collected data from
              a child under 13, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant
              changes by posting a notice on the Service or sending you an email. Your continued use of
              the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{' '}
              <span className="text-violet-400">privacy@fontpreview.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
