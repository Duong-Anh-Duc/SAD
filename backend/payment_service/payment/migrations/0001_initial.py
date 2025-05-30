# Generated by Django 5.1.8 on 2025-05-26 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("appointment_id", models.IntegerField()),
                ("patient_id", models.IntegerField()),
                ("so_tien", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "trang_thai",
                    models.CharField(
                        choices=[
                            ("chua_thanh_toan", "Chưa thanh toán"),
                            ("da_thanh_toan", "Đã thanh toán"),
                            ("huy", "Hủy"),
                        ],
                        default="chua_thanh_toan",
                        max_length=20,
                    ),
                ),
                (
                    "phuong_thuc",
                    models.CharField(
                        choices=[
                            ("tien_mat", "Tiền mặt"),
                            ("chuyen_khoan", "Chuyển khoản"),
                            ("the", "Thẻ"),
                        ],
                        default="tien_mat",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
