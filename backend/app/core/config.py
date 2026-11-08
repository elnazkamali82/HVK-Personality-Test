from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Panjrakh API"
    cors_origins: list[str] = ["http://localhost:3000"]

    # OpenAI-compatible provider. Mode auto: kie.ai → responses, otherwise chat.
    llm_base_url: str = "https://api.openai.com/v1"
    llm_api_key: str = ""
    llm_model: str = "gpt-4o-mini"
    llm_api_mode: Literal["auto", "chat", "responses"] = "auto"
    llm_timeout_seconds: float = 90.0
    llm_temperature: float = 0.4

    model_config = SettingsConfigDict(env_prefix="PANJRAKH_", env_file=".env", extra="ignore")

    @field_validator("llm_base_url", "llm_api_key", "llm_model", mode="before")
    @classmethod
    def strip_strings(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value


settings = Settings()
