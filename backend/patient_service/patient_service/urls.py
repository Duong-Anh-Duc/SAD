from django.urls import path, include

urlpatterns = [
    path('api/patient/', include('patient.urls')),
]