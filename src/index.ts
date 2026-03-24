/**
 * StressZero SDK — Official JavaScript/TypeScript SDK
 *
 * @example
 * ```ts
 * import { StressZero } from 'stresszero-sdk'
 *
 * const sz = new StressZero('sz_live_your_key_here')
 *
 * const result = await sz.analyzeBurnout({
 *   responses: [
 *     { dimension: 'physical', question_id: 'sleep', value: 40, weight: 3 },
 *     { dimension: 'emotional', question_id: 'motivation', value: 55, weight: 2 },
 *     { dimension: 'effectiveness', question_id: 'productivity', value: 35, weight: 2 },
 *   ],
 *   context: { profession: 'entrepreneur', hours_per_week: 60 },
 * })
 *
 * console.log(result.data.score.total) // 43
 * console.log(result.data.risk.level)  // 'high'
 * ```
 *
 * @see https://stresszeroentrepreneur.fr/intelligence-api
 */

// ============================================================
// TYPES
// ============================================================

export type Dimension = "physical" | "emotional" | "effectiveness";
export type RiskLevel = "low" | "moderate" | "high" | "critical";
export type Language = "fr" | "en";
export type ReportFormat = "json" | "html";
export type Tier = "free" | "starter" | "pro" | "enterprise";

export interface ResponseItem {
  dimension: Dimension;
  question_id: string;
  value: number;
  weight?: number;
}

export interface AnalysisContext {
  profession?: string;
  hours_per_week?: number;
  team_size?: number;
  years_experience?: number;
}

export interface ReportContext extends AnalysisContext {
  company_name?: string;
  employee_name?: string;
}

export interface AnalysisOptions {
  include_recommendations?: boolean;
  include_dimensions?: boolean;
  language?: Language;
}

export interface DimensionScore {
  physical: number;
  emotional: number;
  effectiveness: number;
}

export interface BurnoutScore {
  total: number;
  dimensions: DimensionScore;
}

export interface RiskAssessment {
  level: RiskLevel;
  factors: string[];
  urgency: number;
}

export interface SuggestedProduct {
  id: string;
  url: string;
}

export interface ApiMeta {
  api_version: string;
  latency_ms: number;
  quota: {
    used: number;
    limit: number;
    tier: string;
  };
}

export interface AnalysisResult {
  score: BurnoutScore;
  risk: RiskAssessment;
  recommendations: string[];
  suggested_product: SuggestedProduct;
}

export interface DimensionDetail {
  score: number;
  label: string;
  status: "alert" | "warning" | "healthy";
  interpretation: string;
  recommendations: string[];
}

export interface ReportResult {
  report: {
    title: string;
    generated_at: string;
    subject: string;
    company?: string;
  };
  summary: {
    total_score: number;
    risk_level: RiskLevel;
    risk_label: string;
    urgency: number;
    one_liner: string;
  };
  dimensions: {
    physical: DimensionDetail;
    emotional: DimensionDetail;
    effectiveness: DimensionDetail;
  };
  action_plan: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
  context_factors: {
    hours_per_week?: number;
    overwork_alert: boolean;
    years_experience?: number;
  };
  resources: {
    coaching: { url: string; label: string };
    kit: { url: string; label: string };
    guide: { url: string; label: string };
  };
}

export interface ApiKeyResult {
  api_key: string;
  prefix: string;
  tier: string;
  limits: {
    monthly_quota: number;
    rate_limit_per_minute: number;
  };
  message: string;
  docs_url: string;
  quick_start: { curl: string };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    status?: number;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface StressZeroConfig {
  baseUrl?: string;
  timeout?: number;
}

// ============================================================
// SDK CLIENT
// ============================================================

export class StressZero {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(apiKey: string, config: StressZeroConfig = {}) {
    if (!apiKey || !apiKey.startsWith("sz_live_")) {
      throw new Error(
        "Invalid API key. Must start with 'sz_live_'. " +
        "Get your free key at: https://stresszeroentrepreneur.fr/intelligence-api",
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = config.baseUrl || "https://stresszeroentrepreneur.fr";
    this.timeout = config.timeout || 30_000;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "stresszero-sdk/1.0.0",
          ...options.headers,
        },
      });

      return (await response.json()) as ApiResponse<T>;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { success: false, error: { message: "Request timed out" } };
      }
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : "Network error" },
      };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Score burnout risk across 3 dimensions.
   *
   * @example
   * ```ts
   * const result = await sz.analyzeBurnout({
   *   responses: [
   *     { dimension: 'physical', question_id: 'sleep', value: 40, weight: 3 },
   *     { dimension: 'emotional', question_id: 'motivation', value: 55 },
   *     { dimension: 'effectiveness', question_id: 'productivity', value: 35 },
   *   ],
   * })
   * ```
   */
  async analyzeBurnout(params: {
    responses: ResponseItem[];
    context?: AnalysisContext;
    options?: AnalysisOptions;
  }): Promise<ApiResponse<AnalysisResult>> {
    return this.request<AnalysisResult>("/api/v1/analyze-burnout", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  /**
   * Generate a detailed burnout report. Requires Starter+ tier.
   */
  async generateReport(params: {
    responses: ResponseItem[];
    context?: ReportContext;
    language?: Language;
    format?: ReportFormat;
  }): Promise<ApiResponse<ReportResult>> {
    return this.request<ReportResult>("/api/v1/generate-report", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  /**
   * Quick 3-score burnout check.
   */
  async quickCheck(
    physical: number,
    emotional: number,
    effectiveness: number,
    context?: { profession?: string; hours_per_week?: number },
  ): Promise<ApiResponse<AnalysisResult>> {
    return this.analyzeBurnout({
      responses: [
        { dimension: "physical", question_id: "overall", value: physical, weight: 2 },
        { dimension: "emotional", question_id: "overall", value: emotional, weight: 2 },
        { dimension: "effectiveness", question_id: "overall", value: effectiveness, weight: 2 },
      ],
      context,
      options: { include_recommendations: true, language: "fr" },
    });
  }

  /**
   * Create a free API key for a new user.
   */
  async createApiKey(email: string, projectName = "SDK Integration"): Promise<ApiResponse<ApiKeyResult>> {
    return this.request<ApiKeyResult>("/api/v1/keys", {
      method: "POST",
      body: JSON.stringify({ email, name: projectName }),
    });
  }
}

export default StressZero;
