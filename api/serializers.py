from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Citizen, Permission, Role, Profile

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(), write_only=True, many=True, source='permissions'
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'permissions', 'permission_ids']

class ProfileSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), write_only=True, source='role', allow_null=True, required=False
    )

    class Meta:
        model = Profile
        fields = ['id', 'role', 'role_id']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    role_id = serializers.IntegerField(write_only=True, required=False) # For creating/updating user with a role

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile', 'role_id']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        role_id = validated_data.pop('role_id', None)
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()

        if role_id:
            role = Role.objects.get(id=role_id)
            user.profile.role = role
            user.profile.save()
        return user

    def update(self, instance, validated_data):
        role_id = validated_data.pop('role_id', None)
        password = validated_data.pop('password', None)

        instance = super().update(instance, validated_data)

        if password:
            instance.set_password(password)
            instance.save()

        if role_id is not None:
            role = Role.objects.get(id=role_id)
            instance.profile.role = role
            instance.profile.save()
        return instance

class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = '__all__'
