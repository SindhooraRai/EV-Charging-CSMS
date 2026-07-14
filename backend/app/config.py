import os

# Safely attempt to load python-dotenv if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Settings:
    # Project Info
    PROJECT_NAME: str = "VoltGrid CSMS Backend"
    API_V1_STR: str = "/api/v1"
    
    # Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-voltgrid-key-change-in-prod-123456!")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # 24 Hours
    
    # OCPP Gateway Server Configuration
    OCPP_HOST: str = os.getenv("OCPP_HOST", "0.0.0.0")
    OCPP_PORT: int = int(os.getenv("OCPP_PORT", "9000"))
    
    # PostgreSQL Database Configuration
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "voltgrid_csms")
    
    @property
    def DATABASE_URL(self) -> str:
        """
        Derives the connection URL for SQLAlchemy/asyncpg.
        """
        import urllib.parse
        # URL encode password to handle special characters (e.g. spaces/quotes in Supabase env)
        encoded_password = urllib.parse.quote_plus(self.DB_PASSWORD)
        return f"postgresql+asyncpg://{self.DB_USER}:{encoded_password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # Server CORS Configuration
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173", # Vite dev server
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

# Instantiate single settings helper
settings = Settings()
