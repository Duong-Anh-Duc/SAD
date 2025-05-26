from django.urls import path, include

urlpatterns = [
    path('api/doctor/', include('doctor.urls')),
]