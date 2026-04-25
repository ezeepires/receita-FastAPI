from supabase import create_client
from backend.core.config import get_settings

settings = get_settings()

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY,
)

# Cliente com service role para storage
supabase_storage = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
)
