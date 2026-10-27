from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/rakshak"
    ZAP_API_URL: str = "http://localhost:8080"
    ZAP_API_KEY: str = ""
    SECRET_KEY: str = "supersecretkey_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RAZORPAY_KEY_ID: str = "rzp_test_XXXXXXXXXX"
    RAZORPAY_KEY_SECRET: str = "rzp_test_secret_XXXXXXXXXX"

    class Config:
        env_file = ".env"

settings = Settings()
