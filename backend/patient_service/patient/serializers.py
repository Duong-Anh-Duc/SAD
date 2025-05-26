from rest_framework import serializers
from .models import Patient, HealthInsurance
from django.contrib.auth.models import User
import bcrypt

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'ten', 'email', 'mat_khau', 'ngay_sinh', 'gioi_tinh', 'so_dt', 'dia_chi']
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
        
        patient = Patient.objects.create(
            user=user,
            mat_khau=hashed_password.decode('utf-8'),
            **validated_data
        )
        return patient
class PatientUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['ten', 'ngay_sinh', 'gioi_tinh', 'so_dt', 'dia_chi']

    def update(self, instance, validated_data):
        instance.ten = validated_data.get('ten', instance.ten)
        instance.ngay_sinh = validated_data.get('ngay_sinh', instance.ngay_sinh)
        instance.gioi_tinh = validated_data.get('gioi_tinh', instance.gioi_tinh)
        instance.so_dt = validated_data.get('so_dt', instance.so_dt)
        instance.dia_chi = validated_data.get('dia_chi', instance.dia_chi)
        instance.save()
        return instance

class HealthInsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthInsurance
        fields = ['id', 'patient', 'ma_bao_hiem', 'ngay_cap', 'ngay_het_han', 'noi_cap', 'trang_thai', 'muc_huong']