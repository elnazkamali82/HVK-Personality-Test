from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Panjrakh API"
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_prefix="PANJRAKH_")


settings = Settings()
