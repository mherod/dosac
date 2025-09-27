import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { PolicySchema, type Policy } from "./policies";

const POLICIES_DIR = path.join(process.cwd(), "public", "policies");

export async function getServerPolicies(): Promise<Policy[]> {
  try {
    const indexPath = path.join(POLICIES_DIR, "index.json");
    const indexContent = await fs.readFile(indexPath, "utf-8");
    const policyIds = JSON.parse(indexContent) as string[];

    const policies = await Promise.all(
      policyIds.map(async (id) => {
        try {
          const policyPath = path.join(POLICIES_DIR, `${id}.json`);
          const content = await fs.readFile(policyPath, "utf-8");
          const data = JSON.parse(content);
          return PolicySchema.parse(data);
        } catch (error) {
          console.error(`Error loading policy ${id}:`, error);
          return null;
        }
      }),
    );

    return policies.filter((p): p is Policy => p !== null);
  } catch (error) {
    console.error("Error loading policies:", error);
    return [];
  }
}

export async function getServerPolicy(id: string): Promise<Policy | null> {
  try {
    const policyPath = path.join(POLICIES_DIR, `${id}.json`);
    const content = await fs.readFile(policyPath, "utf-8");
    const data = JSON.parse(content);
    return PolicySchema.parse(data);
  } catch (error) {
    console.error(`Error loading policy ${id}:`, error);
    return null;
  }
}

export async function getPoliciesByStatus(status: string): Promise<Policy[]> {
  const policies = await getServerPolicies();
  return policies.filter((p) => p.status === status);
}

export async function getPoliciesByType(type: string): Promise<Policy[]> {
  const policies = await getServerPolicies();
  return policies.filter((p) => p.type === type);
}

export async function getPoliciesByMinister(
  minister: string,
): Promise<Policy[]> {
  const policies = await getServerPolicies();
  return policies.filter((p) =>
    p.minister.toLowerCase().includes(minister.toLowerCase()),
  );
}

export async function searchPolicies(query: string): Promise<Policy[]> {
  const policies = await getServerPolicies();
  const lowerQuery = query.toLowerCase();

  return policies.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.keyFeatures.some((f) => f.toLowerCase().includes(lowerQuery)) ||
      p.nicknames.some((n) => n.toLowerCase().includes(lowerQuery)),
  );
}
