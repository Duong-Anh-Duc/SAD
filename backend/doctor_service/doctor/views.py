from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Doctor
from .serializers import DoctorSerializer
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

class RegisterDoctorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DoctorSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):  # Ném lỗi nếu không hợp lệ
                serializer.save()
                return Response({"message": "Đăng ký thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Đăng ký thất bại", "errors": serializer.errors}, status=400)

class LoginDoctorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        mat_khau = request.data.get('mat_khau')
        try:
            doctor = Doctor.objects.get(email=email)
            if bcrypt.checkpw(mat_khau.encode('utf-8'), doctor.mat_khau.encode('utf-8')):
                if not doctor.user:
                    return Response({"message": "Bác sĩ không có user liên kết"}, status=400)
                refresh = RefreshToken.for_user(doctor.user)
                return Response({
                    "message": "Đăng nhập thành công",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "doctor_id": doctor.id
                }, status=200)
            return Response({"message": "Mật khẩu không đúng"}, status=401)
        except Doctor.DoesNotExist:
            return Response({"message": "Email không tồn tại"}, status=401)

class LogoutDoctorView(APIView):

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

class GetDoctorDetailView(APIView):

    def get(self, request, pk):
        try:
            doctor = Doctor.objects.get(pk=pk)
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data, status=200)
        except Doctor.DoesNotExist:
            return Response({"message": "Bác sĩ không tồn tại"}, status=404)

class GetAllDoctorsView(APIView):

    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data, status=200)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
        except Exception as e:
            return Response({"message": str(e)}, status=400)