from django.urls import path
from .views import PaymentCreateView, PaymentUpdateStatusView, PaymentDetailView, PaymentListView

urlpatterns = [
    path('create/', PaymentCreateView.as_view(), name='payment_create'),
    path('<int:pk>/update-status/', PaymentUpdateStatusView.as_view(), name='payment_update_status'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment_detail'),
    path('list/', PaymentListView.as_view(), name='payment_list'),
]