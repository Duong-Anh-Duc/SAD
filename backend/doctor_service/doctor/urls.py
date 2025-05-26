from django.urls import path
from .views import RegisterDoctorView, LoginDoctorView, LogoutDoctorView, GetDoctorDetailView, GetAllDoctorsView, CustomTokenRefreshView

urlpatterns = [
    path('register/', RegisterDoctorView.as_view(), name='register'),
    path('login/', LoginDoctorView.as_view(), name='login'),
    path('logout/', LogoutDoctorView.as_view(), name='logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('detail/<int:pk>/', GetDoctorDetailView.as_view(), name='get_doctor_detail'),
    path('all/', GetAllDoctorsView.as_view(), name='get_all_doctors'),
]