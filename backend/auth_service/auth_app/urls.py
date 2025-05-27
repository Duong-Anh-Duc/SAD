from django.urls import path
from .views import LoginView, VerifyTokenView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify_token'),
    path('register/', RegisterView.as_view(), name='register'),
]