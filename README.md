# Population Registry

This project is a simple population registry application for Vanuatu, with a Python backend and a React frontend.

## Technologies Used

*   **Backend:**
    *   Python
    *   FastAPI
    *   PostgreSQL
    *   SQLAlchemy
*   **Frontend:**
    *   React
    *   TypeScript
    *   Bootstrap

## Project Structure

```
PopulationRegistry/
├── backend/
│   ├── venv/
│   ├── __init__.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── README.md
│   ├── requirements.txt
│   └── schemas.py
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── README.md
```

## Getting Started

### Prerequisites

*   Python 3.10+
*   Node.js and npm
*   PostgreSQL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd PopulationRegistry
    ```

2.  **Set up the backend:**
    - Navigate to the `backend` directory:
      ```bash
      cd backend
      ```
    - Create and activate a virtual environment:
      ```bash
      python3 -m venv venv
      source venv/bin/activate
      ```
    - Install the required packages:
      ```bash
      pip install -r requirements.txt
      ```

3.  **Set up the frontend:**
    - Navigate to the `frontend` directory:
      ```bash
      cd frontend
      ```
    - Install the required packages:
      ```bash
      npm install
      ```

### Database Setup

1.  **Create a PostgreSQL database** named `population_registry`.
2.  **Create a user** and grant them privileges to the database.
3.  **Update the `SQLALCHEMY_DATABASE_URL`** in `backend/database.py` with your database credentials.

## Running the Application

1.  **Run the backend:**
    - Make sure you are in the root directory of the project (`PopulationRegistry`).
    - Activate the backend virtual environment:
      ```bash
      source backend/venv/bin/activate
      ```
    - Run the application:
      ```bash
      python3 -m uvicorn backend.main:app --reload
      ```
    The backend will be running at `http://127.0.0.1:8000`.

2.  **Run the frontend:**
    - Open a new terminal and navigate to the `frontend` directory:
      ```bash
      cd frontend
      ```
    - Run the application:
      ```bash
      npm start
      ```
    The frontend will be running at `http://localhost:3000`.

Now you can access the application in your browser at `http://localhost:3000`.
