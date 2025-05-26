from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient_id', 'doctor_id', 'ngay_kham', 'gio_kham', 'trang_thai', 'mo_ta', 'created_at', 'updated_at']