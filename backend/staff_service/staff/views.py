from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Staff
from .serializers import StaffSerializer
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken
import requests

class RegisterStaffView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StaffSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Đăng ký thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Đăng ký thất bại", "errors": serializer.errors}, status=400)

class LoginStaffView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        mat_khau = request.data.get('mat_khau')
        try:
            staff = Staff.objects.get(email=email)
            if bcrypt.checkpw(mat_khau.encode('utf-8'), staff.mat_khau.encode('utf-8')):
                if not staff.user:
                    return Response({"message": "Nhân viên không có user liên kết"}, status=400)
                refresh = RefreshToken.for_user(staff.user)
                return Response({
                    "message": "Đăng nhập thành công",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "staff_id": staff.id
                }, status=200)
            return Response({"message": "Mật khẩu không đúng"}, status=401)
        except Staff.DoesNotExist:
            return Response({"message": "Email không tồn tại"}, status=401)

class LogoutStaffView(APIView):
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

class HealthInsuranceListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patient_id = request.query_params.get('patient_id')
        if not patient_id:
            return Response({"message": "Vui lòng cung cấp patient_id"}, status=400)
        try:
            response = requests.get(f'http://localhost:8000/api/patient/health-insurance/?patient_id={patient_id}', 
                                   headers={'Authorization': request.headers.get('Authorization')})
            response.raise_for_status()
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"message": "Không lấy được danh sách bảo hiểm", "error": str(e)}, status=400)

    def post(self, request):
        try:
            response = requests.post('http://localhost:8000/api/patient/health-insurance/', 
                                    json=request.data, 
                                    headers={'Authorization': request.headers.get('Authorization')})
            response.raise_for_status()
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"message": "Thêm bảo hiểm thất bại", "error": str(e)}, status=400)

class HealthInsuranceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            response = requests.get(f'http://localhost:8000/api/patient/health-insurance/{pk}/', 
                                   headers={'Authorization': request.headers.get('Authorization')})
            response.raise_for_status()
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"message": "Không lấy được thông tin bảo hiểm", "error": str(e)}, status=404)

    def put(self, request, pk):
        try:
            response = requests.put(f'http://localhost:8000/api/patient/health-insurance/{pk}/', 
                                   json=request.data, 
                                   headers={'Authorization': request.headers.get('Authorization')})
            response.raise_for_status()
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"message": "Cập nhật bảo hiểm thất bại", "error": str(e)}, status=400)

    def delete(self, request, pk):
        try:
            response = requests.delete(f'http://localhost:8000/api/patient/health-insurance/{pk}/', 
                                      headers={'Authorization': request.headers.get('Authorization')})
            response.raise_for_status()
            return Response(response.json() if response.content else {"message": "Xóa bảo hiểm thành công"}, status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"message": "Xóa bảo hiểm thất bại", "error": str(e)}, status=400)