from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import models
from database import engine, get_db
import os
import httpx
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
api_key = os.getenv("GEMINI_API_KEY")

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI E-Commerce Dashboard API",
    description="Backend API for AI Powered E-Commerce Management Dashboard",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Product Schema
class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    stock: int
    description: Optional[str] = None

# Routes
@app.get("/")
def home():
    return {"message": "AI E-Commerce Dashboard Backend is Running!"}

@app.post("/products")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.put("/products/{product_id}")
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}


@app.get("/analytics/summary")
def get_summary(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    
    total_products = len(products)
    total_stock = sum(p.stock for p in products)
    total_inventory_value = sum(p.price * p.stock for p in products)
    
    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "total_inventory_value": round(total_inventory_value, 2)
    }

@app.get("/analytics/by-category")
def get_by_category(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    
    category_data = {}
    for p in products:
        if p.category not in category_data:
            category_data[p.category] = {"count": 0, "total_value": 0}
        category_data[p.category]["count"] += 1
        category_data[p.category]["total_value"] += p.price * p.stock
    
    return category_data

@app.get("/analytics/low-stock")
def get_low_stock(db: Session = Depends(get_db)):
    low_stock = db.query(models.Product).filter(models.Product.stock < 10).all()
    return low_stock

class ChatMessage(BaseModel):
    message: str


@app.post("/ai/chat")
async def ai_chat(chat: ChatMessage):
    prompt = f"""You are an AI assistant for an e-commerce seller dashboard. 
    Answer only business related questions about e-commerce, products, sales, 
    pricing, and inventory management. Keep answers short and practical.
    Seller's question: {chat.message}"""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    async with httpx.AsyncClient(timeout=30.0) as http_client:
        response = await http_client.post(url, json=payload)
        result = response.json()
        
        # This will show us exactly what Gemini returned
        if "candidates" not in result:
            return {"error": result}
        
        reply = result["candidates"][0]["content"]["parts"][0]["text"]
        return {"reply": reply}