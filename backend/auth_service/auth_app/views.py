from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")  # patient, doctor, admin, staff
        if not username or not password or not role:
            return Response({"error": "Missing username, password, or role"}, status=400)
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user_id": user.id,
                "role": role
            }, status=200)
        return Response({"error": "Invalid credentials"}, status=401)

class VerifyTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"valid": False, "error": "No token provided"}, status=400)
        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            if User.objects.filter(id=user_id).exists():
                return Response({
                    "valid": True,
                    "user_id": user_id,
                    "role": request.data.get("role", "patient")
                }, status=200)
            return Response({"valid": False, "error": "User not found"}, status=401)
        except Exception as e:
            return Response({"valid": False, "error": str(e)}, status=401)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        role = request.data.get("role")
        if not username or not password or not email or not role:
            return Response({"error": "Missing required fields"}, status=400)
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            return Response({"message": "User created", "user_id": user.id}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)