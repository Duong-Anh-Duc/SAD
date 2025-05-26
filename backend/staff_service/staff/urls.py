from django.urls import path
from .views import RegisterStaffView, LoginStaffView, LogoutStaffView, HealthInsuranceListCreateView, HealthInsuranceDetailView

urlpatterns = [
    path('register/', RegisterStaffView.as_view(), name='register'),
    path('login/', LoginStaffView.as_view(), name='login'),
    path('logout/', LogoutStaffView.as_view(), name='logout'),
    path('health-insurance/', HealthInsuranceListCreateView.as_view(), name='health_insurance_list_create'),
    path('health-insurance/<int:pk>/', HealthInsuranceDetailView.as_view(), name='health_insurance_detail'),
]