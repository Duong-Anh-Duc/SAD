from rest_framework import serializers
from .models import ClinicReport

class ClinicReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicReport
        fields = ['id', 'appointment_id', 'patient_id', 'doctor_id', 'ket_luan', 'chan_doan', 'dieu_tri', 'ghi_chu', 'created_at', 'updated_at']