import os
from pydantic_settings import BaseSettings

DEFAULT_SUPABASE_URL = "postgresql://postgres.idpuqiawzrrrksbrkqwm:Rakshak%40%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", DEFAULT_SUPABASE_URL)
    ZAP_API_URL: str = os.getenv("ZAP_API_URL", "http://localhost:8080")
    ZAP_API_KEY: str = os.getenv("ZAP_API_KEY", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey_change_me_in_production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_Tat37tHFRpUGbm")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "0t4wHzsCquWEwcKBNega77Ko")

    class Config:
        env_file = [".env", "web-backend/.env", "../web-backend/.env"]
        extra = "ignore"

settings = Settings()
