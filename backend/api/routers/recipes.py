from fastapi import APIRouter, Depends, HTTPException
from backend.schemas.recipe_schema import Recipe
from backend.core.auth import verify_admin
from backend.services.recipe_service import (
    list_recipes,
    get_recipe,
    create_recipe,
    update_recipe,
    delete_recipe,
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
def recipe_create(recipe: Recipe):
    return create_recipe(recipe.dict())


@router.put("/{recipe_id}", dependencies=[Depends(verify_admin)])
def recipe_update(recipe_id: int, recipe: Recipe):
    return update_recipe(recipe_id, recipe.dict())


@router.delete("/{recipe_id}", dependencies=[Depends(verify_admin)])
def recipe_delete(recipe_id: int):
    return delete_recipe(recipe_id)
