import { z } from "zod";

export const PolicyStatusSchema = z.enum([
  "proposed",
  "brainstorming",
  "launched",
  "active",
  "suspended",
  "axed",
  "abandoned",
]);

export const PolicyTypeSchema = z.enum([
  "education",
  "social",
  "environmental",
  "economic",
  "health",
  "defence",
  "transport",
  "housing",
  "digital",
  "justice",
]);

export const DigitalDividendSchema = z.object({
  enabled: z.boolean(),
  description: z.string().optional(),
});

export const OutcomeSchema = z.object({
  implemented: z.boolean(),
  year: z.number().optional(),
  actualPolicy: z.string().optional(),
  description: z.string(),
  impact: z.string().optional(),
  currentCharge: z.string().optional(),
  notes: z.string().optional(),
});

export const SystemFailureSchema = z.object({
  date: z.string(),
  description: z.string(),
  resolution: z.string().optional(),
});

export const ConsultationSchema = z.object({
  publicConsultation: z
    .object({
      opened: z.string().optional(),
      closed: z.string().optional(),
      responses: z.number().optional(),
      summary: z.string().optional(),
    })
    .optional(),
  stakeholders: z.array(z.string()).optional(),
  expertGroups: z.array(z.string()).optional(),
  focusGroups: z
    .object({
      conducted: z.number().optional(),
      participants: z.number().optional(),
      keyFindings: z.array(z.string()).optional(),
    })
    .optional(),
  impactAssessment: z
    .object({
      conducted: z.boolean(),
      economicImpact: z.string().optional(),
      socialImpact: z.string().optional(),
    })
    .optional(),
});

export const PolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  department: z.string(),
  minister: z.string(),
  status: PolicyStatusSchema,
  type: PolicyTypeSchema,
  description: z.string(),
  keyFeatures: z.array(z.string()),
  digitalDividend: DigitalDividendSchema,
  nicknames: z.array(z.string()),
  frameMentions: z.array(z.string()),
  consultation: ConsultationSchema.optional(),
  outcome: OutcomeSchema.optional(),
  systemFailure: SystemFailureSchema.optional(),
});

export type Policy = z.infer<typeof PolicySchema>;
export type PolicyStatus = z.infer<typeof PolicyStatusSchema>;
export type PolicyType = z.infer<typeof PolicyTypeSchema>;
export type DigitalDividend = z.infer<typeof DigitalDividendSchema>;
export type Outcome = z.infer<typeof OutcomeSchema>;
export type SystemFailure = z.infer<typeof SystemFailureSchema>;
export type Consultation = z.infer<typeof ConsultationSchema>;

export async function getPolicies(): Promise<Policy[]> {
  try {
    const response = await fetch("/api/policies");
    if (!response.ok) {
      throw new Error("Failed to fetch policies");
    }
    const data = await response.json();
    return z.array(PolicySchema).parse(data);
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
}

export async function getPolicy(id: string): Promise<Policy | null> {
  try {
    const response = await fetch(`/api/policies/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return PolicySchema.parse(data);
  } catch (error) {
    console.error(`Error fetching policy ${id}:`, error);
    return null;
  }
}

export function getPolicyStatusColour(status: PolicyStatus): string {
  switch (status) {
    case "active":
    case "launched":
      return "text-green-600";
    case "proposed":
    case "brainstorming":
      return "text-blue-600";
    case "suspended":
      return "text-yellow-600";
    case "axed":
    case "abandoned":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}
