from django.urls import path, include

urlpatterns = [
    path('api/auth/', include('auth_app.urls')),
]