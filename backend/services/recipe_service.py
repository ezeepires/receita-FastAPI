from backend.supabase_client import supabase, supabase_storage
import uuid
from fastapi import UploadFile


async def upload_image(image: UploadFile) -> str:
    # Gerar nome único para o arquivo
    file_extension = image.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    
    # Ler conteúdo do arquivo
    content = await image.read()
    
    # Upload para Supabase Storage (bucket 'images') usando service role
    supabase_storage.storage.from_("images").upload(unique_filename, content)
    
    # Obter URL pública usando o cliente normal
    image_url = supabase.storage.from_("images").get_public_url(unique_filename)
    
    return image_url


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
