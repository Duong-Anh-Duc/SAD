from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'appointment_id', 'patient_id', 'so_tien', 'trang_thai', 'phuong_thuc', 'created_at', 'updated_at']