from django.db import models

class Payment(models.Model):
    appointment_id = models.IntegerField()  # Liên kết với cuộc hẹn
    patient_id = models.IntegerField()      # ID bệnh nhân
    so_tien = models.DecimalField(max_digits=10, decimal_places=2)
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('chua_thanh_toan', 'Chưa thanh toán'),
            ('da_thanh_toan', 'Đã thanh toán'),
            ('huy', 'Hủy'),
        ],
        default='chua_thanh_toan'
    )
    phuong_thuc = models.CharField(
        max_length=20,
        choices=[
            ('tien_mat', 'Tiền mặt'),
            ('chuyen_khoan', 'Chuyển khoản'),
            ('the', 'Thẻ'),
        ],
        default='tien_mat'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Hóa đơn cho bệnh nhân {self.patient_id} - {self.so_tien}"