from django.urls import path
from .views import ClinicReportCreateView, ClinicReportListByUserView, ClinicReportDetailView

urlpatterns = [
    path('create/', ClinicReportCreateView.as_view(), name='clinic_report_create'),
    path('list/user/<int:user_id>/', ClinicReportListByUserView.as_view(), name='clinic_report_list_by_user'),
    path('<int:pk>/', ClinicReportDetailView.as_view(), name='clinic_report_detail'),
]