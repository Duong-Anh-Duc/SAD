from django.urls import path
from .views import RegisterPatientView, LoginPatientView, LogoutPatientView, GetPatientDetailView, GetAllPatientsView, CustomTokenRefreshView, HealthInsuranceListCreateView, HealthInsuranceDetailView

urlpatterns = [
    path('register/', RegisterPatientView.as_view(), name='register'),
    path('login/', LoginPatientView.as_view(), name='login'),
    path('logout/', LogoutPatientView.as_view(), name='logout'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('detail/<int:pk>/', GetPatientDetailView.as_view(), name='get_patient_detail'),
    path('all/', GetAllPatientsView.as_view(), name='get_all_patients'),
    path('health-insurance/', HealthInsuranceListCreateView.as_view(), name='health_insurance_list_create'),
    path('health-insurance/<int:pk>/', HealthInsuranceDetailView.as_view(), name='health_insurance_detail'),
]