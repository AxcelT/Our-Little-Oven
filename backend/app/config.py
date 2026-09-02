from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://oven:oven@localhost:5432/oven"
    s3_endpoint_url: str = "http://localhost:9000"
    s3_bucket: str = "oven-photos"
    s3_access_key: str = "oven"
    s3_secret_key: str = "ovenoven"


settings = Settings()
