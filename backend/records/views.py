from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import HealthRecord
from .serializers import HealthRecordSerializer

@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"})

@api_view(['GET'])
def about(request):
    return Response({
        "studentName": "Hoàng Hoàng",
        "studentId": "YOUR_STUDENT_ID",
        "className": "YOUR_CLASS"
    })

@api_view(['GET', 'POST'])
def record_list_create(request):
    if request.method == 'GET':
        records = HealthRecord.objects.all().order_by('-id')
        serializer = HealthRecordSerializer(records, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = HealthRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def record_update(request, pk):
    try:
        record = HealthRecord.objects.get(pk=pk)
    except HealthRecord.DoesNotExist:
        return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = HealthRecordSerializer(record, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)