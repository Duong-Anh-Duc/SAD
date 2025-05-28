from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from django.db.models import Q
from datetime import datetime

class AppointmentCreateView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Tạo cuộc hẹn thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Tạo cuộc hẹn thất bại", "errors": serializer.errors}, status=400)

class AppointmentProcessView(APIView):
    # permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
            serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Cập nhật cuộc hẹn thành công"}, status=200)
        except Appointment.DoesNotExist:
            return Response({"message": "Cuộc hẹn không tồn tại"}, status=404)
        except Exception as e:
            return Response({"message": "Cập nhật cuộc hẹn thất bại", "errors": serializer.errors}, status=400)

class AppointmentListView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        trang_thai = request.query_params.get('trang_thai', None)
        ngay_kham = request.query_params.get('ngay_kham', None)
        sort_by = request.query_params.get('sort_by', 'ngay_kham')  # Mặc định sắp xếp theo ngày khám

        appointments = Appointment.objects.all()
        if trang_thai:
            appointments = appointments.filter(trang_thai=trang_thai)
        if ngay_kham:
            appointments = appointments.filter(ngay_kham=ngay_kham)

        if sort_by == 'ngay_kham':
            appointments = appointments.order_by('ngay_kham', 'gio_kham')
        elif sort_by == '-ngay_kham':
            appointments = appointments.order_by('-ngay_kham', '-gio_kham')

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=200)

class AppointmentByDoctorView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id):
        trang_thai = request.query_params.get('trang_thai', None)
        ngay_kham = request.query_params.get('ngay_kham', None)
        sort_by = request.query_params.get('sort_by', 'ngay_kham')

        appointments = Appointment.objects.filter(doctor_id=doctor_id)
        if trang_thai:
            appointments = appointments.filter(trang_thai=trang_thai)
        if ngay_kham:
            appointments = appointments.filter(ngay_kham=ngay_kham)

        if sort_by == 'ngay_kham':
            appointments = appointments.order_by('ngay_kham', 'gio_kham')
        elif sort_by == '-ngay_kham':
            appointments = appointments.order_by('-ngay_kham', '-gio_kham')

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=200)

class AppointmentDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
            serializer = AppointmentSerializer(appointment)
            return Response(serializer.data, status=200)
        except Appointment.DoesNotExist:
            return Response({"message": "Cuộc hẹn không tồn tại"}, status=404)
