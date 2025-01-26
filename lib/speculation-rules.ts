import React from "react";

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
    return document.createElement("script").type === "speculationrules";
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
}

export const speculationRules = SpeculationRulesManager.getInstance();

// Hook for React components
export function useSpeculationRules(
  urls: string[],
  options: {
    behavior?: SpeculationBehavior;
    score?: number;
    requires?: SpeculationRequirement[];
    eagerness?: SpeculationEagerness;
  } = {},
) {
  React.useEffect(() => {
    if (urls.length === 0) return;

    const {
      behavior = "prerender",
      score = 0.5,
      requires = ["hover"],
      eagerness = "moderate",
    } = options;

    speculationRules.addUrls(behavior, urls, { score, requires, eagerness });
  }, [
    urls,
    options.behavior,
    options.score,
    options.requires,
    options.eagerness,
    options,
  ]);
}
