from django.db import models

class ClinicReport(models.Model):
    appointment_id = models.IntegerField()  # Liên kết với cuộc hẹn
    patient_id = models.IntegerField()      # ID bệnh nhân
    doctor_id = models.IntegerField()       # ID bác sĩ
    ket_luan = models.TextField()
    chan_doan = models.TextField()
    dieu_tri = models.TextField()
    ghi_chu = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Phiếu kết luận cho bệnh nhân {self.patient_id} từ bác sĩ {self.doctor_id}"