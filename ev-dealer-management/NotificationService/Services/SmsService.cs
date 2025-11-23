using Serilog;

namespace NotificationService.Services;

public class SmsService : ISmsService
{
    public SmsService(IConfiguration configuration)
    {
        Log.Information("SmsService started in MOCK mode (Gia lap).");
    }

    public Task<bool> SendSmsAsync(string phoneNumber, string message)
    {
        // GIẢ LẬP: Chỉ in ra màn hình, không gửi thật
        Console.WriteLine("==================================================");
        Console.WriteLine($"[SMS MOCK] Dang gui tin nhan...");
        Console.WriteLine($"TO      : {phoneNumber}");
        Console.WriteLine($"CONTENT : {message}");
        Console.WriteLine("==================================================");

        Log.Information("Mock SMS sent to {Phone}", phoneNumber);
        
        // QUAN TRỌNG: Luôn trả về TRUE
        return Task.FromResult(true);
    }

    public async Task<bool> SendReservationConfirmationAsync(string phoneNumber, string customerName, string vehicleModel, string colorName)
    {
        var message = $"Hi {customerName}, your reservation for {vehicleModel} ({colorName}) has been confirmed!";
        return await SendSmsAsync(phoneNumber, message);
    }

    public async Task<bool> SendTestDriveReminderAsync(string phoneNumber, string customerName, DateTime scheduledDate)
    {
        var message = $"Reminder: Hi {customerName}, test drive on {scheduledDate:MMM dd}.";
        return await SendSmsAsync(phoneNumber, message);
    }
}