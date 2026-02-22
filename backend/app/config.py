from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    openai_image_model: str = "gpt-image-1"
    cors_origins: str = "http://localhost:5173"
    api_title: str = "AI-Powered 3D Apparel Branding Studio API"
    api_version: str = "0.2.0"
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        origins = [item.strip() for item in self.cors_origins.split(",")]
        filtered = [item for item in origins if item]
        return filtered or ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
