from backend.supabase_client import supabase


def list_recipes() -> list:
    return supabase.table("recipes").select("*").execute().data


def get_recipe(recipe_id: int) -> dict | None:
    result = supabase.table("recipes").select("*").eq("id", recipe_id).execute().data
    return result[0] if result else None


def create_recipe(recipe_data: dict) -> list:
    return supabase.table("recipes").insert(recipe_data).execute().data


def update_recipe(recipe_id: int, recipe_data: dict) -> list:
    return supabase.table("recipes").update(recipe_data).eq("id", recipe_id).execute().data


def delete_recipe(recipe_id: int) -> list:
    return supabase.table("recipes").delete().eq("id", recipe_id).execute().data
