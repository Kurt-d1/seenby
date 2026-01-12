export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: January 12, 2026</p>

        <div className="space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Introduction</h2>
            <p>SeenBy ("we", "our", or "us") is a business visibility audit tool operated by Day One Advisory Ltd. This Privacy Policy explains how we collect, use, and protect information when you use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Business Information:</strong> Business names, addresses, and publicly available data from Google Business Profiles, Facebook Pages, and Instagram accounts that you choose to analyze.</li>
              <li><strong>Website Data:</strong> Publicly available website performance metrics from Google PageSpeed Insights.</li>
              <li><strong>Usage Data:</strong> How you interact with our service, including searches performed and reports generated.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. How We Use Information</h2>
            <p className="mb-2">We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide business visibility audits and competitive analysis</li>
              <li>Generate reports comparing your business to competitors</li>
              <li>Improve our service and develop new features</li>
              <li>Cache results to improve performance and reduce API usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Data Sources</h2>
            <p className="mb-2">We gather publicly available data from:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google Places API (business listings, ratings, reviews)</li>
              <li>Google PageSpeed Insights API (website performance)</li>
              <li>Meta/Facebook Graph API (public page information)</li>
              <li>Meta Ad Library (public advertising data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Data Storage and Security</h2>
            <p>We store data securely using industry-standard encryption and security practices. Cached data is retained for up to 7 days to improve service performance. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Third-Party Services</h2>
            <p>Our service integrates with third-party APIs including Google and Meta. Your use of our service is also subject to their respective privacy policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request access to data we hold about your business</li>
              <li>Request deletion of cached data</li>
              <li>Opt out of our service at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-2">
              <strong>Day One Advisory Ltd</strong><br />
              Malta<br />
              Email: info@dayoneadvisory.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new policy on this page.</p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200">
          <a href="/" className="text-indigo-600 hover:underline">← Back to SeenBy</a>
        </div>
      </div>
    </div>
  )
}