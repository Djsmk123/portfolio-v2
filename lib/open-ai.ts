// import { openAiConfig } from './config'
// import OpenAI from 'openai'
// import { z } from 'zod'

// const openaiProvider = new OpenAI({
//   apiKey: openAiConfig.openaiApiKey,
//   baseURL: openAiConfig.openaiBaseUrl || undefined
// })

// export type LlmError = {
//   code: string
//   message: string
//   details?: unknown
// }

// export type LlmJsonResult<T> =
//   | { ok: true, data: T }
//   | { ok: false, error: LlmError }

// type JsonResponseOptions = {
//   temperature?: number
//   maxTokens?: number
//   timeoutMs?: number
//   retries?: number
//   systemPreamble?: string
//   schemaName?: string
// }

// function withAbortTimeout (ms: number): AbortController {
//   const controller = new AbortController()
//   const id = setTimeout(() => controller.abort(), ms)
//   // Clear timeout when signal completes
//   controller.signal.addEventListener('abort', () => clearTimeout(id), { once: true })
//   return controller
// }

// function buildSystemPrompt (schemaName: string): string {
//   return [
//     'You are a strict JSON generator.',
//     'Return ONLY valid JSON without any prose, markdown, or code fences.',
//     `The JSON must conform to the "${schemaName}" schema provided implicitly by the caller.`,
//     'If you cannot comply or input is insufficient, return an error object like:',
//     '{"error": {"code": "UNPROCESSABLE", "message": "reason here"}}'
//   ].join(' ')
// }

// export async function openaiJsonResponse<T> (
//   prompt: string,
//   schema: z.ZodType<T>,
//   options: JsonResponseOptions = {}
// ): Promise<LlmJsonResult<T>> {
//   const {
//     temperature = 0,
//     maxTokens = 800,
//     timeoutMs = 20_000,
//     retries = 2,
//     systemPreamble
//   } = options

//   if (!openAiConfig.openaiApiKey) {
//     return { ok: false, error: { code: 'NO_API_KEY', message: 'OPENAI_API_KEY is not configured' } }
//   }

//   const system = systemPreamble || buildSystemPrompt(options.schemaName || 'Output')
//   let lastError: LlmError | null = null

//   for (let attempt = 0; attempt <= retries; attempt++) {
//     try {
//       const controller = withAbortTimeout(timeoutMs)
//       const resp = await openaiProvider.chat.completions.create({
//         model: openAiConfig.openaiModel,
//         temperature,
//         max_tokens: maxTokens,
//         response_format: { type: 'json_object' },
//         messages: [
//           { role: 'system', content: system },
//           { role: 'user', content: prompt }
//         ]
//       }, { signal: controller.signal })

//       const content = resp.choices?.[0]?.message?.content || ''
//       if (!content) {
//         lastError = { code: 'EMPTY_CONTENT', message: 'LLM returned empty content' }
//         continue
//       }

//       let parsed: unknown
//       try {
//         parsed = JSON.parse(content)
//       } catch (e) {
//         lastError = { code: 'INVALID_JSON', message: 'LLM did not return valid JSON', details: content }
//         continue
//       }

//       // If model returned explicit error shape, surface it
//       if (parsed && typeof parsed === 'object' && 'error' in (parsed as any)) {
//         const err = (parsed as any).error
//         const code = typeof err?.code === 'string' ? err.code : 'LLM_ERROR'
//         const message = typeof err?.message === 'string' ? err.message : 'Unknown LLM error'
//         return { ok: false, error: { code, message, details: parsed } }
//       }

//       const safe = schema.safeParse(parsed)
//       if (!safe.success) {
//         lastError = { code: 'SCHEMA_VALIDATION_FAILED', message: safe.error.message, details: parsed }
//         continue
//       }

//       return { ok: true, data: safe.data }
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Unknown error'
//       lastError = { code: 'OPENAI_REQUEST_FAILED', message }
//       // brief backoff before retry except last attempt
//       if (attempt < retries) await new Promise(r => setTimeout(r, 250 * (attempt + 1)))
//     }
//   }

//   return { ok: false, error: lastError || { code: 'UNKNOWN', message: 'Unknown failure' } }
// }

// // Convenience helper for error schema results
// export const ErrorResponseSchema = z.object({
//   error: z.object({
//     code: z.string(),
//     message: z.string(),
//     details: z.unknown().optional()
//   })
// })
