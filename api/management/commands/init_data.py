from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Permission, Role, Profile

class Command(BaseCommand):
    help = 'Initializes default roles, permissions, and users.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Initializing default data...'))

        # Create Permissions
        permissions_to_create = [
            "create_citizen", "view_citizen", "edit_citizen", "delete_citizen",
            "manage_users", "manage_roles", "manage_permissions"
        ]
        created_permissions = {}
        for perm_name in permissions_to_create:
            permission, created = Permission.objects.get_or_create(name=perm_name)
            created_permissions[perm_name] = permission
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created permission: {perm_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Permission already exists: {perm_name}'))

        # Create Roles
        # Admin Role
        admin_role, created = Role.objects.get_or_create(name="admin")
        if created:
            self.stdout.write(self.style.SUCCESS('Created role: admin'))
            admin_role.permissions.set(created_permissions.values()) # Assign all permissions
        else:
            self.stdout.write(self.style.WARNING('Role already exists: admin'))

        # User Role
        user_role, created = Role.objects.get_or_create(name="user")
        if created:
            self.stdout.write(self.style.SUCCESS('Created role: user'))
            user_role.permissions.set([
                created_permissions["create_citizen"],
                created_permissions["view_citizen"],
                created_permissions["edit_citizen"]
            ])
        else:
            self.stdout.write(self.style.WARNING('Role already exists: user'))

        # Assign role to superuser (htevilili)
        try:
            superuser = User.objects.get(username="htevilili")
            if superuser.profile.role != admin_role:
                superuser.profile.role = admin_role
                superuser.profile.save()
                self.stdout.write(self.style.SUCCESS(f'Assigned admin role to superuser: {superuser.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'Superuser {superuser.username} already has admin role.'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Superuser "htevilili" not found. Please create one first.'))

        self.stdout.write(self.style.SUCCESS('Default data initialization complete.'))
