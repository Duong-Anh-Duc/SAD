from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Patient, HealthInsurance
from .serializers import PatientSerializer, HealthInsuranceSerializer, PatientUpdateSerializer
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import status

def get_user_id(request):
    user_id = request.headers.get("X-User-ID")
    if not user_id:
        return Response({"message": "User ID not provided"}, status=status.HTTP_401_UNAUTHORIZED)
    return int(user_id)

class RegisterPatientView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Đăng ký thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Đăng ký thất bại", "errors": serializer.errors}, status=400)

class LoginPatientView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        mat_khau = request.data.get('mat_khau')
        try:
            patient = Patient.objects.get(email=email)
            if bcrypt.checkpw(mat_khau.encode('utf-8'), patient.mat_khau.encode('utf-8')):
                if not patient.user:
                    return Response({"message": "Bệnh nhân không có user liên kết"}, status=400)
                refresh = RefreshToken.for_user(patient.user)
                return Response({
                    "message": "Đăng nhập thành công",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "patient_id": patient.id
                }, status=200)
            return Response({"message": "Mật khẩu không đúng"}, status=401)
        except Patient.DoesNotExist:
            return Response({"message": "Email không tồn tại"}, status=401)

class LogoutPatientView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"message": "Refresh token không được cung cấp"}, status=400)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Đăng xuất thành công"}, status=200)
        except Exception as e:
            return Response({"message": f"Đăng xuất thất bại: {str(e)}"}, status=400)

class GetPatientDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user_id = get_user_id(request)
        if user_id != pk:
            return Response({"message": "Không có quyền truy cập"}, status=403)
        try:
            patient = Patient.objects.get(pk=pk)
            serializer = PatientSerializer(patient)
            insurances = HealthInsurance.objects.filter(patient=pk)
            insurance_serializer = HealthInsuranceSerializer(insurances, many=True)
            return Response({
                "patient": serializer.data,
                "health_insurances": insurance_serializer.data
            }, status=200)
        except Patient.DoesNotExist:
            return Response({"message": "Bệnh nhân không tồn tại"}, status=404)

class GetAllPatientsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=200)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
        except Exception as e:
            return Response({"message": str(e)}, status=400)

class HealthInsuranceListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = get_user_id(request)
        patient_id = request.query_params.get('patient_id')
        if not patient_id:
            return Response({"message": "Vui lòng cung cấp patient_id"}, status=400)
        if int(patient_id) != user_id:
            return Response({"message": "Không có quyền truy cập"}, status=403)
        insurances = HealthInsurance.objects.filter(patient_id=patient_id)
        serializer = HealthInsuranceSerializer(insurances, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        user_id = get_user_id(request)
        if int(request.data.get('patient_id')) != user_id:
            return Response({"message": "Không có quyền thêm bảo hiểm"}, status=403)
        serializer = HealthInsuranceSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Thêm bảo hiểm thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Thêm bảo hiểm thất bại", "errors": serializer.errors}, status=400)

class HealthInsuranceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user_id = get_user_id(request)
        try:
            insurance = HealthInsurance.objects.get(pk=pk)
            if insurance.patient_id != user_id:
                return Response({"message": "Không có quyền truy cập"}, status=403)
            serializer = HealthInsuranceSerializer(insurance)
            return Response(serializer.data, status=200)
        except HealthInsurance.DoesNotExist:
            return Response({"message": "Bảo hiểm không tồn tại"}, status=404)

    def put(self, request, pk):
        user_id = get_user_id(request)
        try:
            insurance = HealthInsurance.objects.get(pk=pk)
            if insurance.patient_id != user_id:
                return Response({"message": "Không có quyền cập nhật"}, status=403)
            serializer = HealthInsuranceSerializer(insurance, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Cập nhật bảo hiểm thành công"}, status=200)
        except HealthInsurance.DoesNotExist:
            return Response({"message": "Bảo hiểm không tồn tại"}, status=404)
        except Exception as e:
            return Response({"message": "Cập nhật bảo hiểm thất bại", "errors": serializer.errors}, status=400)

    def delete(self, request, pk):
        user_id = get_user_id(request)
        try:
            insurance = HealthInsurance.objects.get(pk=pk)
            if insurance.patient_id != user_id:
                return Response({"message": "Không có quyền xóa"}, status=403)
            insurance.delete()
            return Response({"message": "Xóa bảo hiểm thành công"}, status=204)
        except HealthInsurance.DoesNotExist:
            return Response({"message": "Bảo hiểm không tồn tại"}, status=404)

class UpdatePatientView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user_id = get_user_id(request)
        if user_id != pk:
            return Response({"message": "Không có quyền cập nhật"}, status=403)
        try:
            patient = Patient.objects.get(pk=pk)
            serializer = PatientUpdateSerializer(patient, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Cập nhật thông tin thành công"}, status=200)
        except Patient.DoesNotExist:
            return Response({"message": "Bệnh nhân không tồn tại"}, status=404)
        except Exception as e:
            return Response({"message": "Cập nhật thất bại", "errors": serializer.errors}, status=400)
