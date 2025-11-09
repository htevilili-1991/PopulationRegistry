from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow administrators to edit objects.
    Read-only access is allowed for authenticated users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class HasPermission(permissions.BasePermission):
    """
    Custom permission to check if the user has a specific permission.
    """
    def __init__(self, required_permission):
        self.required_permission = required_permission

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admins have all permissions
        if request.user.is_staff:
            return True

        # Check if the user's role has the required permission
        if hasattr(request.user, 'profile') and request.user.profile.role:
            return request.user.profile.role.permissions.filter(name=self.required_permission).exists()
        return False
