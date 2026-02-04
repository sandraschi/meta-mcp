import { logger } from '../utils/logger'

export interface LLMConfig {
    provider: 'ollama' | 'lmstudio' | 'openai'
    baseUrl: string
    model: string
}

export interface LLMModel {
    id: string
    object: string
    created: number
    owned_by: string
}

const DEFAULT_CONFIG: LLMConfig = {
    provider: 'ollama',
    baseUrl: 'http://localhost:11434',
    model: 'llama3'
}

class LLMService {
    private config: LLMConfig

    constructor() {
        this.config = this.loadConfig()
    }

    private loadConfig(): LLMConfig {
        const saved = localStorage.getItem('meta_mcp_llm_config')
        if (saved) {
            try {
                return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }
            } catch (e) {
                logger.error('Failed to parse saved LLM config', { error: e })
            }
        }
        return DEFAULT_CONFIG
    }

    saveConfig(config: LLMConfig) {
        this.config = config
        localStorage.setItem('meta_mcp_llm_config', JSON.stringify(config))
        logger.info('LLM Config saved', config)
    }

    getConfig(): LLMConfig {
        return this.config
    }

    async listModels(): Promise<LLMModel[]> {
        try {
            let url = ''
            if (this.config.provider === 'ollama') {
                url = `${this.config.baseUrl.replace(/\/$/, '')}/api/tags`
            } else {
                // OpenAI compatible (LMStudio, etc)
                url = `${this.config.baseUrl.replace(/\/$/, '')}/v1/models`
            }

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.statusText}`)
            }

            const data = await response.json()

            if (this.config.provider === 'ollama') {
                // Ollama returns { models: [{ name: '...', ... }] }
                return (data.models || []).map((m: any) => ({
                    id: m.name,
                    object: 'model',
                    created: Date.now(),
                    owned_by: 'ollama'
                }))
            } else {
                // OpenAI style { data: [{ id: '...', ... }] }
                return data.data || []
            }
        } catch (error) {
            logger.error('Failed to list LLM models', { error })
            throw error
        }
    }

    async completion(prompt: string): Promise<string> {
        // Basic completion implementation
        try {
            const { provider, baseUrl, model } = this.config
            let url = ''
            let body = {}

            if (provider === 'ollama') {
                url = `${baseUrl.replace(/\/$/, '')}/api/generate`
                body = {
                    model: model,
                    prompt: prompt,
                    stream: false
                }
            } else {
                url = `${baseUrl.replace(/\/$/, '')}/v1/chat/completions`
                body = {
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false
                }
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error(`LLM Request failed: ${response.statusText}`)
            }

            const data = await response.json()

            if (provider === 'ollama') {
                return data.response
            } else {
                return data.choices?.[0]?.message?.content || ''
            }

        } catch (error) {
            logger.error('LLM Completion failed', { error })
            throw error
        }
    }
}

export const llmService = new LLMService()
