from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Panjrakh API"
    cors_origins: list[str] = ["http://localhost:3000"]

    # OpenAI-compatible chat API (OpenAI, Azure OpenAI, vLLM, Ollama, LiteLLM, …)
    llm_base_url: str = "https://api.openai.com/v1"
    llm_api_key: str = ""
    llm_model: str = "gpt-4o-mini"
    llm_timeout_seconds: float = 60.0
    llm_temperature: float = 0.4

    model_config = SettingsConfigDict(env_prefix="PANJRAKH_", env_file=".env", extra="ignore")


settings = Settings()
