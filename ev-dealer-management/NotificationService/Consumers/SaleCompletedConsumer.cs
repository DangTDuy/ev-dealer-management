using NotificationService.DTOs;
using NotificationService.Services;
using Serilog;
using System.Text.Json;

namespace NotificationService.Consumers;

public class SaleCompletedConsumer
{
    private readonly IEmailService _emailService;

    public SaleCompletedConsumer(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task HandleAsync(string message)
    {
        try
        {
            var saleEvent = JsonSerializer.Deserialize<SaleCompletedEvent>(message);
            if (saleEvent == null)
            {
                Log.Warning("Failed to deserialize SaleCompletedEvent from message: {Message}", message);
                return;
            }

            Log.Information("Processing SaleCompletedEvent for Order: {OrderId}", saleEvent.OrderId);

            var success = await _emailService.SendOrderConfirmationAsync(
                saleEvent.CustomerEmail,
                saleEvent.CustomerName,
                saleEvent.VehicleModel,
                saleEvent.TotalPrice,
                saleEvent.OrderId
            );

            if (success)
            {
                Log.Information("Order confirmation email sent for Order: {OrderId}", saleEvent.OrderId);
            }
            else
            {
                Log.Error("Failed to send order confirmation email for Order: {OrderId}", saleEvent.OrderId);
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error processing SaleCompletedEvent");
        }
    }
}
