from django.urls import path
from .views import health_check, about, record_list_create, record_update

urlpatterns = [
    path('health/', health_check),
    path('about/', about),
    path('api/records/', record_list_create),
    path('api/records/<int:pk>/', record_update),
]