export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: January 12, 2026</p>

        <div className="space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using SeenBy ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Description of Service</h2>
            <p>SeenBy is a business visibility audit tool that analyzes publicly available data about businesses from various sources including Google, Facebook, and Instagram. The Service provides competitive analysis and visibility scoring.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Use of Service</h2>
            <p className="mb-2">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service to harass, abuse, or harm another person or business</li>
              <li>Use the Service for any fraudulent or deceptive purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to access the Service in a manner that exceeds reasonable use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Data Accuracy</h2>
            <p>While we strive to provide accurate information, the Service relies on third-party data sources. We do not guarantee the accuracy, completeness, or timeliness of any information provided. Social media metrics may be estimated based on available data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are owned by Day One Advisory Ltd and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Limitation of Liability</h2>
            <p>In no event shall Day One Advisory Ltd be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. Continued use of the Service after any changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Contact Us</h2>
            <p>If you have questions about these Terms, please contact us at:</p>
            <p className="mt-2">
              <strong>Day One Advisory Ltd</strong><br />
              Malta<br />
              Email: info@dayoneadvisory.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200">
          <a href="/" className="text-indigo-600 hover:underline">← Back to SeenBy</a>
        </div>
      </div>
    </div>
  )
}