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
// SDK CLIENT
// ============================================================
export class StressZero {
    apiKey;
    baseUrl;
    timeout;
    constructor(apiKey, config = {}) {
        if (!apiKey || !apiKey.startsWith("sz_live_")) {
            throw new Error("Invalid API key. Must start with 'sz_live_'. " +
                "Get your free key at: https://stresszeroentrepreneur.fr/intelligence-api");
        }
        this.apiKey = apiKey;
        this.baseUrl = config.baseUrl || "https://stresszeroentrepreneur.fr";
        this.timeout = config.timeout || 30_000;
    }
    async request(endpoint, options = {}) {
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
            return (await response.json());
        }
        catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                return { success: false, error: { message: "Request timed out" } };
            }
            return {
                success: false,
                error: { message: error instanceof Error ? error.message : "Network error" },
            };
        }
        finally {
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
    async analyzeBurnout(params) {
        return this.request("/api/v1/analyze-burnout", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    /**
     * Generate a detailed burnout report. Requires Starter+ tier.
     */
    async generateReport(params) {
        return this.request("/api/v1/generate-report", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    /**
     * Quick 3-score burnout check.
     */
    async quickCheck(physical, emotional, effectiveness, context) {
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
    async createApiKey(email, projectName = "SDK Integration") {
        return this.request("/api/v1/keys", {
            method: "POST",
            body: JSON.stringify({ email, name: projectName }),
        });
    }
}
export default StressZero;
//# sourceMappingURL=index.js.map