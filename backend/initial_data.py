from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend import models, crud, schemas
from backend.security import get_password_hash

def drop_all_tables():
    models.Base.metadata.drop_all(bind=engine)
    print("All tables dropped.")

# Ensure all tables are created
models.Base.metadata.create_all(bind=engine)

def create_initial_data(db: Session):
    # Create Permissions
    permissions_to_create = [
        "create_citizen", "view_citizen", "edit_citizen", "delete_citizen",
        "manage_users", "manage_roles", "manage_permissions"
    ]
    created_permissions = {}
    for perm_name in permissions_to_create:
        permission = crud.get_permission_by_name(db, name=perm_name)
        if not permission:
            permission = crud.create_permission(db=db, permission=schemas.PermissionCreate(name=perm_name))
        created_permissions[perm_name] = permission

    # Create Roles
    # Admin Role
    admin_role = crud.get_role_by_name(db, name="admin")
    if not admin_role:
        admin_permission_ids = [p.id for p in created_permissions.values()]
        admin_role = crud.create_role(db=db, role=schemas.RoleCreate(name="admin", permission_ids=admin_permission_ids))

    # User Role
    user_role = crud.get_role_by_name(db, name="user")
    if not user_role:
        user_permission_ids = [
            created_permissions["create_citizen"].id,
            created_permissions["view_citizen"].id,
            created_permissions["edit_citizen"].id
        ]
        user_role = crud.create_role(db=db, role=schemas.RoleCreate(name="user", permission_ids=user_permission_ids))

    # Create Users
    # Admin User
    admin_user = crud.get_user_by_username(db, username="admin")
    if not admin_user:
        admin_user = crud.create_user(
            db=db,
            user=schemas.UserCreate(
                username="admin",
                email="admin@example.com",
                password="admin", # TODO: Change default password in production
                role_id=admin_role.id
            )
        )

    # Regular User
    regular_user = crud.get_user_by_username(db, username="user")
    if not regular_user:
        regular_user = crud.create_user(
            db=db,
            user=schemas.UserCreate(
                username="user",
                email="user@example.com",
                password="user", # TODO: Change default password in production
                role_id=user_role.id
            )
        )

    print("Initial data created successfully!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        drop_all_tables() # Drop existing tables
        models.Base.metadata.create_all(bind=engine) # Recreate tables
        create_initial_data(db)
    finally:
        db.close()
