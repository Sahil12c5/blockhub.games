import Breadcrumbs from "@/components/Breadcrumbs";
import { ShieldCheck, Lock, Cookie, Eye } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Cookies Disclosure | BlockHub.games",
  description:
    "Privacy Policy for BlockHub.games, detailing data collection, cookie usage, and Google AdSense advertising compliance disclosures.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-sm space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Legal Document
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Privacy Policy & Cookies Disclosure
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Effective Date: January 1, 2026 • Last updated: October 2026
          </p>
        </div>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            1. Introduction & Overview
          </h2>
          <p>
            At <strong>BlockHub.games</strong> (&ldquo;BlockHub,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), accessible from{" "}
            <a href="https://blockhub.games" className="text-emerald-400 underline">
              https://blockhub.games
            </a>
            , the privacy of our visitors is of paramount importance to us. This Privacy Policy outlines the types of information that is collected and recorded by BlockHub.games and how we use it to provide a seamless, secure, and enjoyable browser gaming experience.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, please contact our privacy compliance team via our{" "}
            <a href="/contact" className="text-emerald-400 underline">
              Contact Page
            </a>
            .
          </p>
        </section>

        {/* AdSense Specific Cookie & Advertising Disclosures */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <Cookie className="h-4 w-4 text-emerald-400" />
            2. Google AdSense & Third-Party Advertising Disclosures
          </h2>
          <p>
            Google is a third-party vendor on our site. Google uses cookies, specifically known as <strong>DoubleClick DART cookies</strong>, to serve advertisements to our site visitors based upon their visit to BlockHub.games and other websites across the Internet.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline"
              >
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              Alternatively, visitors can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline"
              >
                aboutads.info
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-400" />
            3. Log Files & Analytics
          </h2>
          <p>
            BlockHub.games follows a standard procedure of utilizing log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of this information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, BlockHub.games uses &ldquo;cookies&rdquo;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">5. Third-Party Game Embed Providers</h2>
          <p>
            Our website embeds interactive games provided by trusted third-party game distribution networks, such as GameMonetize and GameDistribution. These networks may also use cookies, JavaScript, or Web Beacons within their embedded iframes to measure the effectiveness of their advertising campaigns and to personalize the advertising content that you see. BlockHub.games has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">6. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California consumers have the right to request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers, and request that a business delete any personal data about the consumer that a business has collected. BlockHub.games does not sell personal information to third parties.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">7. GDPR Data Protection Rights</h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following: the right to access, rectification, erasure, restrict processing, object to processing, and data portability. If you make a request, we have one month to respond to you.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">8. Children&apos;s Information Protection (COPPA)</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. BlockHub.games does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">9. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </section>
      </div>
    </div>
  );
}
