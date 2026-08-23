from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('detect/', views.detect_news, name='detect_news'),
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.login_user, name='login_user'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),
    path('auth/reset-password/', views.reset_password, name='reset_password'),
    path('history/', views.get_history, name='get_history'),
    path('history/<int:id>/', views.delete_history_item, name='delete_history_item'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('contact/', views.submit_contact, name='contact'),
]