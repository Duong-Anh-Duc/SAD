from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer

class PaymentCreateView(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Tạo hóa đơn thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Tạo hóa đơn thất bại", "errors": serializer.errors}, status=400)

class PaymentUpdateStatusView(APIView):
    #permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
            serializer = PaymentSerializer(payment, data={'trang_thai': request.data.get('trang_thai')}, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Cập nhật trạng thái hóa đơn thành công"}, status=200)
        except Payment.DoesNotExist:
            return Response({"message": "Hóa đơn không tồn tại"}, status=404)
        except Exception as e:
            return Response({"message": "Cập nhật trạng thái hóa đơn thất bại", "errors": serializer.errors}, status=400)

class PaymentDetailView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=200)
        except Payment.DoesNotExist:
            return Response({"message": "Hóa đơn không tồn tại"}, status=404)

class PaymentListView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        trang_thai = request.query_params.get('trang_thai', None)
        patient_id = request.query_params.get('patient_id', None)

        payments = Payment.objects.all()
        if trang_thai:
            payments = payments.filter(trang_thai=trang_thai)
        if patient_id:
            payments = payments.filter(patient_id=patient_id)

        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=200)