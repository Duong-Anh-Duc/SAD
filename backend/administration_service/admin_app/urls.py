from django.urls import path
from .views import RegisterAdminView, LoginAdminView, LogoutAdminView

urlpatterns = [
    path('register/', RegisterAdminView.as_view(), name='register'),
    path('login/', LoginAdminView.as_view(), name='login'),
    path('logout/', LogoutAdminView.as_view(), name='logout'),
]