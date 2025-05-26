from django.db import models
from django.contrib.auth.models import User

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    ten = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mat_khau = models.CharField(max_length=128)
    khoa = models.CharField(max_length=100)  # Đổi từ nganh thành khoa
    chuc_vu = models.CharField(
        max_length=50,
        choices=[
            ('truong_khoa', 'Trưởng khoa'),
            ('pho_khoa', 'Phó khoa'),
            ('bac_si', 'Bác sĩ'),
        ],
        default='bac_si'
    )  # Thêm trường chức vụ
    gioi_thieu = models.TextField()
    so_dt = models.CharField(max_length=15)

    def __str__(self):
        return self.ten