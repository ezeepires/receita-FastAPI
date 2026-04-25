from pydantic import BaseModel, Field

class Recipe(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    image_url: str = Field(default="", max_length=500)
