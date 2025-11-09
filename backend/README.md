# Population Registry Backend

This is the backend for the Population Registry application, built with Python and FastAPI.

## Setup and Running

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Set up the database:**
    - Make sure you have PostgreSQL installed and running.
    - Create a database named `population_registry`.
    - Update the `SQLALCHEMY_DATABASE_URL` in `database.py` with your PostgreSQL credentials.

3.  **Run the application:**
    ```bash
    uvicorn main:app --reload
    ```

The application will be running at `http://127.0.0.1:8000`.
