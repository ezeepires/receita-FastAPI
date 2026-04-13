from pydantic import BaseModel

class Recipe(BaseModel):
    title: str
    description: str
    price: float
    image_url: str
    whatsapp_number: str
    whatsapp_message: str

