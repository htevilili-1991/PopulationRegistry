from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .models import Citizen, Permission, Role, Profile
from .serializers import CitizenSerializer, PermissionSerializer, RoleSerializer, UserSerializer
from .permissions import IsAdminOrReadOnly, HasPermission

class CustomTokenObtainPairView(TokenObtainPairView):
    # This view is already provided by simplejwt, no custom logic needed here unless we want to customize the token claims
    pass

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAdminUser] # Only admin can manage permissions

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser] # Only admin can manage roles

    def create(self, request, *args, **kwargs):
        permission_ids = request.data.get('permission_ids', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.save()
        role.permissions.set(permission_ids) # Set permissions for the role
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        permission_ids = request.data.get('permission_ids', None)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        role = serializer.save()
        if permission_ids is not None:
            role.permissions.set(permission_ids)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] # Only admin can manage users

    def get_queryset(self):
        # Allow non-admin users to view their own profile
        if self.action == 'retrieve' and not self.request.user.is_staff:
            return User.objects.filter(id=self.request.user.id)
        return super().get_queryset()

    def get_permissions(self):
        if self.action == 'create': # Only admin can create users
            self.permission_classes = [IsAdminUser]
        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            # Admin can manage any user, regular user can only view/update their own profile
            self.permission_classes = [IsAdminUser | (IsAuthenticated and HasPermission('view_user'))] # Placeholder for view_user permission
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CitizenViewSet(viewsets.ModelViewSet):
    queryset = Citizen.objects.all()
    serializer_class = CitizenSerializer
    permission_classes = [IsAuthenticated, HasPermission('view_citizen')] # Default permission

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [IsAuthenticated, HasPermission('create_citizen')]
        elif self.action in ['update', 'partial_update']:
            self.permission_classes = [IsAuthenticated, HasPermission('edit_citizen')]
        elif self.action == 'destroy':
            self.permission_classes = [IsAuthenticated, HasPermission('delete_citizen')]
        return super().get_permissions()