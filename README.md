# Population Registry

This project is a simple population registry application for Vanuatu, with a Python backend and a React frontend. It includes user management with roles and permissions for secure access control.

## Technologies Used

*   **Backend:**
    *   Python
    *   FastAPI
    *   PostgreSQL
    *   SQLAlchemy
    *   `python-jose` for JWT authentication
    *   `hashlib` for password hashing (as a workaround for `passlib` environment issues)
*   **Frontend:**
    *   React
    *   TypeScript
    *   Bootstrap
    *   `react-router-dom` for navigation
    *   `axios` for API communication

## Project Structure

```
PopulationRegistry/
├── backend/
│   ├── venv/
│   ├── __init__.py
│   ├── crud.py             # CRUD operations for Citizens, Users, Roles, Permissions
│   ├── database.py         # Database configuration (PostgreSQL)
│   ├── initial_data.py     # Script to initialize roles, permissions, and default users
│   ├── main.py             # FastAPI application, API endpoints, authentication, authorization
│   ├── models.py           # SQLAlchemy models for Citizen, User, Role, Permission
│   ├── README.md
│   ├── requirements.txt    # Python dependencies
│   ├── schemas.py          # Pydantic schemas for data validation and serialization
│   └── security.py         # Password hashing and JWT token utilities
└── frontend/
    ├── public/
    ├── src/
    │   ├── api.ts          # Frontend API calls to the backend
    │   ├── App.tsx         # Main React component, authentication context, routing
    │   ├── types.ts        # TypeScript interfaces for data models
    │   └── components/     # React components (AddCitizen, CitizenList, EditCitizen, Login, Register)
    ├── package.json        # Frontend dependencies
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
2.  **Create a user** (e.g., `htevilili`) and grant them privileges to the database.
3.  **Update the `SQLALCHEMY_DATABASE_URL`** in `backend/database.py` with your database credentials. Example:
    ```python
    SQLALCHEMY_DATABASE_URL = "postgresql://htevilili:your_password@localhost/population_registry"
    ```
4.  **Initialize Database with Roles, Permissions, and Users:**
    - Make sure your backend virtual environment is activated (`source backend/venv/bin/activate`).
    - Run the `initial_data.py` script. This will drop any existing tables, recreate them, and populate with default roles, permissions, and users.
      ```bash
      python3 -m backend.initial_data
      ```

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

## Technical Details

### User Management, Roles, and Permissions

The application implements a robust user management system with role-based access control (RBAC):

*   **Authentication:** Users authenticate using a username and password to obtain a JSON Web Token (JWT). This token is then used for subsequent authenticated requests.
*   **Authorization:**
    *   **Roles:** Users are assigned roles (e.g., `admin`, `user`).
    *   **Permissions:** Roles are associated with specific permissions (e.g., `create_citizen`, `view_citizen`, `edit_citizen`, `delete_citizen`, `manage_users`, `manage_roles`, `manage_permissions`).
    *   API endpoints are protected by `Depends(check_user_permission("permission_name"))` or by checking for admin roles.
*   **Models:**
    *   `User`: Stores user details including `username`, `email`, `hashed_password`, `is_active`, and a `role_id` linking to the `Role` model.
    *   `Role`: Defines user roles with a `name` (e.g., "admin", "user") and a many-to-many relationship with `Permission` through the `role_permissions` association table.
    *   `Permission`: Defines granular permissions with a `name`.
*   **Default Setup:**
    *   The `initial_data.py` script creates:
        *   **Permissions:** `create_citizen`, `view_citizen`, `edit_citizen`, `delete_citizen`, `manage_users`, `manage_roles`, `manage_permissions`.
        *   **Roles:**
            *   `admin`: Granted all available permissions.
            *   `user`: Granted `create_citizen`, `view_citizen`, `edit_citizen` permissions.
        *   **Users:**
            *   `admin` (password: `admin`, email: `admin@example.com`, role: `admin`)
            *   `user` (password: `user`, email: `user@example.com`, role: `user`)
    *   **Note:** Public user registration is disabled. Only logged-in administrators can create new users via the backend API.

### Citizen Management

*   **National ID:** Citizens now require a `national_id` which is a unique identifier. This field is not randomly generated and must be provided upon creation.

### Frontend User Experience

*   **Login-First Approach:** Upon visiting the application, users are redirected to the login page.
*   **Conditional Navigation:** The main navigation sidebar and content are only displayed after a successful login.
*   **Logout:** A "Logout" button replaces the "Login" link once a user is authenticated.

### Password Hashing

*   Initially, `passlib` was intended for password hashing. Due to persistent environment-specific `ModuleNotFoundError` issues, the backend has been configured to use Python's built-in `hashlib` with `pbkdf2_hmac` for password hashing.
*   **Security Note:** While `hashlib` provides a secure hashing mechanism, `passlib` offers a more comprehensive and robust solution for password management in production environments. It is recommended to resolve any `passlib` environment issues for a production deployment.

## API Endpoints

The backend exposes the following API endpoints:

*   `/token` (POST): Authenticate user and receive JWT.
*   `/users/register/` (POST): Register a new user (admin-only).
*   `/users/me/` (GET): Get current authenticated user's details.
*   `/users/` (GET): Get all users (admin-only).
*   `/users/{user_id}` (GET): Get user by ID (admin-only).
*   `/citizens/` (GET, POST): Get all citizens or create a new citizen (permission-based).
*   `/citizens/{citizen_id}` (GET, PUT, DELETE): Get, update, or delete a citizen by ID (permission-based).
*   `/roles/` (GET, POST): Get all roles or create a new role (admin-only).
*   `/roles/{role_id}` (GET): Get role by ID (admin-only).
*   `/permissions/` (GET, POST): Get all permissions or create a new permission (admin-only).