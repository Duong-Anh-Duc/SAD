from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from django.db.models import Q
from datetime import datetime
from rest_framework import status
from fastapi import HTTPException

def get_user_id(request):
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User ID not provided")
    try:
        return int(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid User ID format")

class AppointmentCreateView(APIView):
    def post(self, request):
        user_id = get_user_id(request)
        if request.data.get('patient_id') != user_id:
            return Response({"message": "Không có quyền tạo cuộc hẹn"}, status=403)
        serializer = AppointmentSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Tạo cuộc hẹn thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Tạo cuộc hẹn thất bại", "errors": serializer.errors}, status=400)

class AppointmentProcessView(APIView):
    def put(self, request, pk):
        user_id = get_user_id(request)
        try:
            appointment = Appointment.objects.get(pk=pk)
            if appointment.patient_id != user_id:
                return Response({"message": "Không có quyền cập nhật"}, status=403)
            serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Cập nhật cuộc hẹn thành công"}, status=200)
        except Appointment.DoesNotExist:
            return Response({"message": "Cuộc hẹn không tồn tại"}, status=404)
        except Exception as e:
            return Response({"message": "Cập nhật cuộc hẹn thất bại", "errors": serializer.errors}, status=400)

class AppointmentListView(APIView):
    def get(self, request):
        user_id = get_user_id(request)
        trang_thai = request.query_params.get('trang_thai')
        ngay_kham = request.query_params.get('ngay_kham')
        sort_by = request.query_params.get('sort_by', 'ngay_kham')

        appointments = Appointment.objects.filter(patient_id=user_id)
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
    def get(self, request, doctor_id):
        user_id = get_user_id(request)
        trang_thai = request.query_params.get('trang_thai')
        ngay_kham = request.query_params.get('ngay_kham')
        sort_by = request.query_params.get('sort_by', 'ngay_kham')

        appointments = Appointment.objects.filter(doctor_id=doctor_id, patient_id=user_id)
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
    def get(self, request, pk):
        user_id = get_user_id(request)
        try:
            appointment = Appointment.objects.get(pk=pk, patient_id=user_id)
            serializer = AppointmentSerializer(appointment)
            return Response(serializer.data, status=200)
        except Appointment.DoesNotExist:
            return Response({"message": "Cuộc hẹn không tồn tại"}, status=404)