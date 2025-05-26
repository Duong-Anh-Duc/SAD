from rest_framework import serializers
from .models import Staff
from django.contrib.auth.models import User
import bcrypt

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ['id', 'ten', 'email', 'mat_khau']
        extra_kwargs = {'mat_khau': {'write_only': True}}

    def create(self, validated_data):
        mat_khau = validated_data.pop('mat_khau')
        hashed_password = bcrypt.hashpw(mat_khau.encode('utf-8'), bcrypt.gensalt())
        
        email = validated_data.get('email')
        if User.objects.filter(username=email).exists():
            raise serializers.ValidationError({"email": "Email đã tồn tại."})

        user = User.objects.create_user(
            username=email,
            email=email,
            password=mat_khau
        )
        
        staff = Staff.objects.create(
            user=user,
            mat_khau=hashed_password.decode('utf-8'),
            **validated_data
        )
        return staff