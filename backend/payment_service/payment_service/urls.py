from django.urls import path, include

urlpatterns = [
    path('api/payment/', include('payment.urls')),
]