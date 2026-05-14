from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from backend.schemas.recipe_schema import Recipe
from backend.core.auth import verify_admin
from backend.services.recipe_service import (
    list_recipes,
    get_recipe,
    create_recipe,
    update_recipe,
    delete_recipe,
    upload_image,
)
from urllib.parse import quote_plus

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get("")
def recipes_list():
    return list_recipes()


@router.get("/{recipe_id}")
def recipe_detail(recipe_id: int):
    recipe = get_recipe(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    return recipe


@router.post("", dependencies=[Depends(verify_admin)])
async def recipe_create(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...)
):
    image_url = await upload_image(image)
    
    recipe_data = {
        "title": title,
        "description": description,
        "image_url": image_url,
    }
    return create_recipe(recipe_data)


@router.put("/{recipe_id}", dependencies=[Depends(verify_admin)])
async def recipe_update(
    recipe_id: int,
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(None)
):
    recipe_data = {
        "title": title,
        "description": description,
    }

    existing = get_recipe(recipe_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    if image and image.filename:
        image_url = await upload_image(image)
        recipe_data["image_url"] = image_url
    else:
        recipe_data["image_url"] = existing.get("image_url", "")

    return update_recipe(recipe_id, recipe_data)


@router.delete("/{recipe_id}", dependencies=[Depends(verify_admin)])
def recipe_delete(recipe_id: int):
    return delete_recipe(recipe_id)
