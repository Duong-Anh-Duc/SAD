from django.urls import path, include

urlpatterns = [
    path('api/clinic-report/', include('clinic_report.urls')),
]