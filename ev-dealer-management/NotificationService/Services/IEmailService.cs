namespace NotificationService.Services;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string htmlContent, string? plainTextContent = null);
    Task<bool> SendOrderConfirmationAsync(string customerEmail, string customerName, string vehicleModel, decimal totalPrice, string orderId);
    Task<bool> SendTestDriveConfirmationAsync(string customerEmail, string customerName, string vehicleModel, DateTime scheduledDate);
}
