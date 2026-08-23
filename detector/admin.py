from django.contrib import admin
from .models import Submission
from .models import ContactMessage

admin.site.register(Submission)
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at")
    readonly_fields = ("created_at",)