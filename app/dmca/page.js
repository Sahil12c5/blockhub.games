import Breadcrumbs from "@/components/Breadcrumbs";
import { ShieldAlert, Mail, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "DMCA Copyright Notice & Takedown Procedure",
  description:
    "Digital Millennium Copyright Act (DMCA) policy, copyright claim guidelines, and designated takedown agent contact information for BlockHub.games.",
};

export default function DmcaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: "DMCA Notice" }]} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-sm space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Copyright Policy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            DMCA Copyright Notice
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Digital Millennium Copyright Act (17 U.S.C. § 512) Compliance
          </p>
        </div>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">1. Statement of Principle</h2>
          <p>
            <strong>BlockHub.games</strong> respects the intellectual property rights of game developers, artists, and creators. It is our policy to respond promptly to clear, documented notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;) and other applicable intellectual property laws.
          </p>
          <p>
            Most games accessible on BlockHub are embedded via official API feeds from authorized game distribution networks (such as GameMonetize and GameDistribution) where developers publish and monetize their titles. If you believe your copyrighted work has been improperly embedded or shared on BlockHub without authorization, we will expeditiously remove or disable access to the infringing material.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed p-5 rounded-xl bg-slate-950/80 border border-slate-800">
          <h2 className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-400" />
            2. Filing a DMCA Notice of Infringement
          </h2>
          <p>
            To file a formal copyright infringement notification with our designated agent, please email a written communication containing the following items to{" "}
            <a
              href="mailto:sahilchawan005@gmail.com"
              className="text-emerald-400 font-mono font-bold underline"
            >
              sahilchawan005@gmail.com
            </a>
            :
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-300">
            <li>
              A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
            </li>
            <li>
              Identification of the copyrighted work claimed to have been infringed (or a representative list if multiple works).
            </li>
            <li>
              Identification of the material that is claimed to be infringing, with specific URL link(s) on BlockHub.games so our team can locate it immediately.
            </li>
            <li>
              Information reasonably sufficient to permit us to contact you, such as your full name, physical mailing address, telephone number, and email address.
            </li>
            <li>
              A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
            </li>
            <li>
              A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.
            </li>
          </ol>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">3. Takedown Timeline</h2>
          <p>
            Upon receipt of a valid and complete DMCA notification, our designated copyright compliance team will disable or remove the contested game embed within <strong>24 to 48 hours</strong>, and notify the game submitter or distributor accordingly.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">4. Designated Copyright Agent</h2>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
            <p>BlockHub Copyright Compliance Team</p>
            <p>Attn: Designated DMCA Agent</p>
            <p>Email: sahilchawan005@gmail.com</p>
            <p>Website: https://blockhub.games</p>
          </div>
        </section>
      </div>
    </div>
  );
}
