from pydantic import BaseModel

class Recipe(BaseModel):
    title: str
    description: str
    image_url: str
