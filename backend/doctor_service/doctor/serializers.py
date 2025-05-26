from rest_framework import serializers
from .models import Doctor
from django.contrib.auth.models import User
import bcrypt

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'ten', 'email', 'mat_khau', 'khoa', 'chuc_vu', 'gioi_thieu', 'so_dt']
        extra_kwargs = {'mat_khau': {'write_only': True}}

    def create(self, validated_data):
        mat_khau = validated_data.pop('mat_khau')
        hashed_password = bcrypt.hashpw(mat_khau.encode('utf-8'), bcrypt.gensalt())
        
        email = validated_data.get('email')
        try:
            # Kiểm tra xem email đã tồn tại trong bảng User chưa
            if User.objects.filter(username=email).exists():
                raise serializers.ValidationError({"email": "Email đã tồn tại."})

            # Tạo user mới
            user = User.objects.create_user(
                username=email,
                email=email,
                password=mat_khau
            )
            
            # Tạo doctor mới
            doctor = Doctor.objects.create(
                user=user,
                mat_khau=hashed_password.decode('utf-8'),
                **validated_data
            )
            return doctor
        except Exception as e:
            # Nếu có lỗi, xóa user vừa tạo (nếu có) để tránh dữ liệu rác
            if 'user' in locals():
                user.delete()
            raise serializers.ValidationError({"error": str(e)})