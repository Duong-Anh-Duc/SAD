from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    ten = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mat_khau = models.CharField(max_length=128)
    ngay_sinh = models.DateField()
    gioi_tinh = models.CharField(max_length=10)
    so_dt = models.CharField(max_length=15)
    dia_chi = models.CharField(max_length=255, default="Không xác định")

    def __str__(self):
        return self.ten

class HealthInsurance(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='health_insurances')
    ma_bao_hiem = models.CharField(max_length=20, unique=True)
    ngay_cap = models.DateField()
    ngay_het_han = models.DateField()
    noi_cap = models.CharField(max_length=100)
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('con_hieu_luc', 'Còn hiệu lực'),
            ('het_han', 'Hết hạn'),
        ],
        default='con_hieu_luc'
    )
    muc_huong = models.IntegerField(default=80)

    def __str__(self):
        return self.ma_bao_hiem