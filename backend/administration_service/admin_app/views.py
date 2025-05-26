from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Admin
from .serializers import AdminSerializer
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterAdminView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Đăng ký thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Đăng ký thất bại", "errors": serializer.errors}, status=400)

class LoginAdminView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        mat_khau = request.data.get('mat_khau')
        try:
            admin = Admin.objects.get(email=email)
            if bcrypt.checkpw(mat_khau.encode('utf-8'), admin.mat_khau.encode('utf-8')):
                if not admin.user:
                    return Response({"message": "Quản trị viên không có user liên kết"}, status=400)
                refresh = RefreshToken.for_user(admin.user)
                return Response({
                    "message": "Đăng nhập thành công",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "admin_id": admin.id
                }, status=200)
            return Response({"message": "Mật khẩu không đúng"}, status=401)
        except Admin.DoesNotExist:
            return Response({"message": "Email không tồn tại"}, status=401)

class LogoutAdminView(APIView):
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