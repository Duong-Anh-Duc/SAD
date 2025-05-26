from django.db import models

class Appointment(models.Model):
    patient_id = models.IntegerField()  # Liên kết với bệnh nhân
    doctor_id = models.IntegerField()   # Liên kết với bác sĩ
    ngay_kham = models.DateField()
    gio_kham = models.TimeField()
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('cho_xac_nhan', 'Chờ xác nhận'),
            ('da_xac_nhan', 'Đã xác nhận'),
            ('da_huy', 'Đã hủy'),
            ('hoan_thanh', 'Hoàn thành'),
        ],
        default='cho_xac_nhan'
    )
    mo_ta = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cuộc hẹn của bệnh nhân {self.patient_id} với bác sĩ {self.doctor_id} ngày {self.ngay_kham}"