from django.urls import path
from .views import AppointmentCreateView, AppointmentProcessView, AppointmentListView, AppointmentByDoctorView, AppointmentDetailView, PatientAppointmentsView

urlpatterns = [
    path('create/', AppointmentCreateView.as_view(), name='appointment_create'),
    path('<int:pk>/process/', AppointmentProcessView.as_view(), name='appointment_process'),
    path('list/', AppointmentListView.as_view(), name='appointment_list'),
    path('doctor/<int:doctor_id>/', AppointmentByDoctorView.as_view(), name='appointment_by_doctor'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
    path('patient/<int:patient_id>/', PatientAppointmentsView.as_view(), name='patient_appointments'), # Thêm endpoint mới
]