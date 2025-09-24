import { getServerPolicies } from "@/lib/policies.server";
import { PolicyCard } from "@/components/policy-card";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Policy Unit - Department of Social Affairs and Citizenship",
  description:
    "Official repository of departmental policy initiatives, strategic programmes, and legislative frameworks. Browse current government work, policy development, and historical records.",
  keywords: [
    "DoSAC",
    "government policy",
    "policy unit",
    "legislation",
    "strategic initiatives",
    "departmental programmes",
    "policy development",
    "public consultation",
  ],
  openGraph: {
    title: "Policy Unit - DoSAC",
    description:
      "Official repository of departmental policy initiatives and strategic programmes",
    type: "website",
    siteName: "Department of Social Affairs and Citizenship",
  },
  twitter: {
    card: "summary_large_image",
    title: "Policy Unit - DoSAC",
    description:
      "Official repository of departmental policy initiatives and strategic programmes",
  },
};

export default async function PoliciesPage() {
  const policies = await getServerPolicies();

  // Group policies by status
  const currentWork = policies.filter(
    (p) =>
      p.status === "active" ||
      p.status === "launched" ||
      p.status === "proposed",
  );
  const underDevelopment = policies.filter((p) => p.status === "brainstorming");
  const historicalPolicies = policies.filter(
    (p) =>
      p.status === "suspended" ||
      p.status === "axed" ||
      p.status === "abandoned",
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* GOV.UK style breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-[#1d70b8] hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-500">›</li>
            <li className="text-gray-700">Policy Unit</li>
          </ol>
        </nav>
        {/* GOV.UK style header */}
        <div className="mb-8 pb-6">
          <span className="mb-2 inline-block text-sm font-bold uppercase text-gray-500">
            Collection
          </span>
          <h1 className="mb-4 text-5xl font-bold text-[#0b0c0c]">
            Policy Unit
          </h1>
          <p className="text-xl leading-relaxed text-gray-600">
            Official repository of departmental policy initiatives, strategic
            programmes, and legislative frameworks.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              Published{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>
              Last updated{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Contents section */}
        <div className="mb-12 border-l-4 border-[#1d70b8] bg-gray-50 p-4">
          <h2 className="mb-2 text-lg font-semibold">Contents</h2>
          <ul className="space-y-1 text-[#1d70b8]">
            {currentWork.length > 0 && (
              <li>
                <a href="#current" className="hover:underline">
                  Current departmental work
                </a>
              </li>
            )}
            {underDevelopment.length > 0 && (
              <li>
                <a href="#development" className="hover:underline">
                  Policy development
                </a>
              </li>
            )}
            {historicalPolicies.length > 0 && (
              <li>
                <a href="#historical" className="hover:underline">
                  Historical record
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Current Work */}
        {currentWork.length > 0 && (
          <div className="mb-12" id="current">
            <h2 className="mb-6 border-b-2 border-gray-200 pb-2 text-2xl font-bold text-[#0b0c0c]">
              Current departmental work
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentWork.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          </div>
        )}

        {/* Under Development */}
        {underDevelopment.length > 0 && (
          <div className="mb-12" id="development">
            <h2 className="mb-6 border-b-2 border-gray-200 pb-2 text-2xl font-bold text-[#0b0c0c]">
              Policy development
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {underDevelopment.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          </div>
        )}

        {/* Historical Policies */}
        {historicalPolicies.length > 0 && (
          <div className="mb-12" id="historical">
            <h2 className="mb-6 border-b-2 border-gray-200 pb-2 text-2xl font-bold text-[#0b0c0c]">
              Historical record
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {historicalPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
          <p>
            This information is published under the Freedom of Information Act
            2000. For enquiries, contact the Policy Unit at
            policy.unit@dosac.gov.uk
          </p>
          <p className="mt-2">
            Classification: OFFICIAL | Document Reference: POL-2024-INDEX
          </p>
        </div>
      </div>
    </main>
  );
}
