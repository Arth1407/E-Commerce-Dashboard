# E-Commerce-Dashboard

## Backend Setup

### 1. Go to the backend folder

cd backend

### 2. Create a virtual environment

python3 -m venv venv

### 3. Activate the virtual environment

source venv/bin/activate

### 4. Install dependencies

pip install -r requirements.txt

### 5. Create the .env file

Add your Gemini API key:

GEMINI_API_KEY=your_api_key_here

### 6. Start the backend

uvicorn main:app --reload

