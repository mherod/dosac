import { getServerPolicy, getServerPolicies } from "@/lib/policies.server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPolicyStatusColour } from "@/lib/policies";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Users,
  Calendar,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 3600;

type Props = {
  params: Promise<{ policy: string }>;
};

export async function generateStaticParams() {
  const policies = await getServerPolicies();
  return policies.map((policy) => ({
    policy: policy.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { policy: policyId } = await params;
  const policy = await getServerPolicy(policyId);

  if (!policy) {
    return {
      title: "Policy Not Found - DoSAC",
    };
  }

  return {
    title: `${policy.name} - DoSAC Policy Unit`,
    description: policy.description,
  };
}

export default async function PolicyPage({ params }: Props) {
  const { policy: policyId } = await params;
  const policy = await getServerPolicy(policyId);

  if (!policy) {
    notFound();
  }

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
            <li>
              <Link href="/policies" className="text-[#1d70b8] hover:underline">
                Policy Unit
              </Link>
            </li>
            <li className="text-gray-500">›</li>
            <li className="text-gray-700">{policy.shortName}</li>
          </ol>
        </nav>

        {/* GOV.UK style header */}
        <div className="mb-8">
          <span className="mb-2 inline-block text-sm font-bold uppercase text-gray-500">
            Policy documentation
          </span>
          <h1 className="mb-4 text-5xl font-bold text-[#0b0c0c]">
            {policy.name}
          </h1>
          <p className="mb-4 text-xl leading-relaxed text-gray-600">
            {policy.description}
          </p>
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              Published{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="mb-6 border-l-4 border-[#1d70b8] bg-blue-50 p-4">
            <p className="text-sm">
              <strong>Applies to:</strong> England and Wales
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Key Features */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {policy.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-[#1d70b8]">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Consultation Process */}
            {policy.consultation && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Consultation Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {policy.consultation.publicConsultation && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">
                        Public Consultation
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Period:{" "}
                          {policy.consultation.publicConsultation.opened} to{" "}
                          {policy.consultation.publicConsultation.closed}
                        </p>
                        {policy.consultation.publicConsultation.responses && (
                          <p>
                            Responses received:{" "}
                            {policy.consultation.publicConsultation.responses.toLocaleString()}
                          </p>
                        )}
                        {policy.consultation.publicConsultation.summary && (
                          <p className="mt-2 italic">
                            {policy.consultation.publicConsultation.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {policy.consultation.stakeholders &&
                    policy.consultation.stakeholders.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Key Stakeholders Consulted
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {policy.consultation.stakeholders.map(
                            (stakeholder, i) => (
                              <li key={i}>• {stakeholder}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {policy.consultation.focusGroups && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700">
                        Focus Groups
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Sessions conducted:{" "}
                          {policy.consultation.focusGroups.conducted}
                        </p>
                        <p>
                          Total participants:{" "}
                          {policy.consultation.focusGroups.participants}
                        </p>
                        {policy.consultation.focusGroups.keyFindings && (
                          <div className="mt-2">
                            <p className="font-medium">Key findings:</p>
                            <ul className="mt-1 space-y-1">
                              {policy.consultation.focusGroups.keyFindings.map(
                                (finding, i) => (
                                  <li key={i}>• {finding}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {policy.consultation.impactAssessment && (
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">
                        Impact Assessment
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        {policy.consultation.impactAssessment
                          .economicImpact && (
                          <div>
                            <span className="font-medium">
                              Economic impact:
                            </span>
                            <p className="mt-1">
                              {
                                policy.consultation.impactAssessment
                                  .economicImpact
                              }
                            </p>
                          </div>
                        )}
                        {policy.consultation.impactAssessment.socialImpact && (
                          <div>
                            <span className="font-medium">Social impact:</span>
                            <p className="mt-1">
                              {
                                policy.consultation.impactAssessment
                                  .socialImpact
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Outcome */}
            {policy.outcome && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Implementation Outcome
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {policy.outcome.actualPolicy && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Final Policy:
                        </span>
                        <p className="mt-1 font-semibold text-[#0b0c0c]">
                          {policy.outcome.actualPolicy}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Description:
                      </span>
                      <p className="mt-1 text-gray-700">
                        {policy.outcome.description}
                      </p>
                    </div>
                    {policy.outcome.impact && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Impact:
                        </span>
                        <p className="mt-1 text-gray-700">
                          {policy.outcome.impact}
                        </p>
                      </div>
                    )}
                    {policy.outcome.notes && (
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-sm italic text-gray-600">
                          {policy.outcome.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Failure */}
            {policy.systemFailure && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    System Notice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Date:</span>{" "}
                      {policy.systemFailure.date}
                    </p>
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Issue:</span>{" "}
                      {policy.systemFailure.description}
                    </p>
                    {policy.systemFailure.resolution && (
                      <p className="text-sm text-red-700">
                        <span className="font-medium">Resolution:</span>{" "}
                        {policy.systemFailure.resolution}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Digital Dividend */}
            {policy.digitalDividend.enabled && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Digital Dividend Programme</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                  {policy.digitalDividend.description && (
                    <p className="mt-3 text-gray-700">
                      {policy.digitalDividend.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            {/* Policy Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Policy Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Minister Responsible:
                  </span>
                  <p className="mt-1 font-semibold">{policy.minister}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Policy Type:
                  </span>
                  <p className="mt-1 font-semibold capitalize">{policy.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Status:
                  </span>
                  <p className="mt-1">
                    <Badge
                      variant="outline"
                      className={`capitalize ${getPolicyStatusColour(policy.status)}`}
                    >
                      {policy.status}
                    </Badge>
                  </p>
                </div>
                {policy.nicknames.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Alternative Names:
                    </span>
                    <p className="mt-1 italic text-gray-600">
                      {policy.nicknames.join(", ")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documentation References */}
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    Reference ID:{" "}
                    <span className="font-mono">{policy.id.toUpperCase()}</span>
                  </p>
                  <p className="text-gray-600">
                    Mentions:{" "}
                    <span className="font-semibold">
                      {policy.frameMentions.length}
                    </span>{" "}
                    references
                  </p>
                  {policy.outcome && policy.outcome.year && (
                    <p className="text-gray-600">
                      Implementation Year:{" "}
                      <span className="font-semibold">
                        {policy.outcome.year}
                      </span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
          <p>
            This policy document is published under the Freedom of Information
            Act 2000. For enquiries regarding this policy, contact
            policy.unit@dosac.gov.uk
          </p>
          <p className="mt-2">
            Classification: OFFICIAL | Document Reference: POL-
            {policy.id.toUpperCase()}-2024
          </p>
        </div>
      </div>
    </main>
  );
}
