from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ClinicReport
from .serializers import ClinicReportSerializer

class ClinicReportCreateView(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ClinicReportSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "Tạo phiếu kết luận thành công"}, status=201)
        except Exception as e:
            return Response({"message": "Tạo phiếu kết luận thất bại", "errors": serializer.errors}, status=400)

class ClinicReportListByUserView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        reports = ClinicReport.objects.filter(patient_id=user_id)
        serializer = ClinicReportSerializer(reports, many=True)
        return Response(serializer.data, status=200)

class ClinicReportDetailView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            report = ClinicReport.objects.get(pk=pk)
            serializer = ClinicReportSerializer(report)
            return Response(serializer.data, status=200)
        except ClinicReport.DoesNotExist:
            return Response({"message": "Phiếu kết luận không tồn tại"}, status=404)