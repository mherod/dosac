import { useEffect } from "react";

type SpeculationBehavior = "prerender" | "prefetch";
type SpeculationEagerness = "conservative" | "moderate" | "eager";
type SpeculationRequirement = "hover" | "visible";

interface SpeculationRule {
  source: "list" | "document";
  urls: string[];
  score?: number;
  requires?: SpeculationRequirement[];
  eagerness?: SpeculationEagerness;
}

interface SpeculationRules {
  prerender?: SpeculationRule[];
  prefetch?: SpeculationRule[];
}

class SpeculationRulesManager {
  private static instance: SpeculationRulesManager;
  private rules: SpeculationRules = {};
  private script: HTMLScriptElement | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): SpeculationRulesManager {
    if (!SpeculationRulesManager.instance) {
      SpeculationRulesManager.instance = new SpeculationRulesManager();
    }
    return SpeculationRulesManager.instance;
  }

  public isSupported(): boolean {
    return (
      HTMLScriptElement.supports?.("speculationrules") ||
      document.createElement("script").type === "speculationrules"
    );
  }

  public addRule(
    behavior: SpeculationBehavior,
    rule: Omit<SpeculationRule, "urls"> & { urls: string[] },
  ): void {
    if (!this.rules[behavior]) {
      this.rules[behavior] = [];
    }
    this.rules[behavior]!.push(rule);
    this.updateScript();
  }

  public addUrls(
    behavior: SpeculationBehavior,
    urls: string[],
    options: Omit<SpeculationRule, "urls" | "source"> = {},
  ): void {
    this.addRule(behavior, {
      source: "list",
      urls,
      score: options.score ?? 0.5,
      requires: options.requires ?? ["hover"],
      eagerness: options.eagerness ?? "moderate",
    });
  }

  public clearRules(): void {
    this.rules = {};
    this.updateScript();
  }

  private updateScript(): void {
    if (!this.isSupported()) return;

    if (!this.script) {
      this.script = document.createElement("script");
      this.script.type = "speculationrules";
      document.head.appendChild(this.script);
    }

    this.script.text = JSON.stringify(this.rules);
  }

  public removeUrls(behavior: SpeculationBehavior, urls: string[]): void {
    if (!this.rules[behavior]) return;

    // Filter out rules containing any of the specified URLs
    this.rules[behavior] = this.rules[behavior]!.filter(
      (rule) => !urls.some((url: string) => rule.urls.includes(url)),
    );

    this.updateScript();
  }
}

export const speculationRules = SpeculationRulesManager.getInstance();

// Hook for React components
/**
 * Manages speculation rules for prefetching/prerendering URLs
 * @param urls - Array of URLs to apply speculation rules to
 * @param options - Configuration options for the speculation rules
 * @param options.behavior - Type of speculation to perform (prerender/prefetch)
 * @param options.score - Priority score for the URLs (0-1)
 * @param options.requires - Conditions required for speculation
 * @param options.eagerness - How eager to be about speculating
 */
export function useSpeculationRules(
  urls: string[],
  options: {
    behavior?: SpeculationBehavior;
    score?: number;
    requires?: SpeculationRequirement[];
    eagerness?: SpeculationEagerness;
  } = {},
): void {
  const {
    behavior = "prerender",
    score = 0.5,
    requires = ["hover"],
    eagerness = "moderate",
  } = options;

  useEffect(() => {
    if (urls.length === 0) return;

    speculationRules.addUrls(behavior, urls, { score, requires, eagerness });

    return () => {
      speculationRules.removeUrls(behavior, urls);
    };
  }, [urls, behavior, score, requires, eagerness]);
}
