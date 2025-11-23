namespace NotificationService.Services;

public interface ISmsService
{
    Task<bool> SendSmsAsync(string phoneNumber, string message);
    Task<bool> SendReservationConfirmationAsync(string phoneNumber, string customerName, string vehicleModel, string colorName);
    Task<bool> SendTestDriveReminderAsync(string phoneNumber, string customerName, DateTime scheduledDate);
}
