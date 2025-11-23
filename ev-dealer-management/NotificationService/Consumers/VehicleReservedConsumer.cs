using NotificationService.DTOs;
using NotificationService.Services;
using Serilog;
using System.Text.Json;

namespace NotificationService.Consumers;

public class VehicleReservedConsumer
{
    private readonly ISmsService _smsService;

    public VehicleReservedConsumer(ISmsService smsService)
    {
        _smsService = smsService;
    }

    public async Task HandleAsync(string message)
    {
        try
        {
            var reservedEvent = JsonSerializer.Deserialize<VehicleReservedEvent>(message);
            if (reservedEvent == null)
            {
                Log.Warning("Failed to deserialize VehicleReservedEvent from message: {Message}", message);
                return;
            }

            Log.Information("Processing VehicleReservedEvent for Reservation: {ReservationId}", reservedEvent.ReservationId);

            var success = await _smsService.SendReservationConfirmationAsync(
                reservedEvent.CustomerPhone,
                reservedEvent.CustomerName,
                reservedEvent.VehicleModel,
                reservedEvent.ColorName
            );

            if (success)
            {
                Log.Information("Reservation confirmation SMS sent for Reservation: {ReservationId}", reservedEvent.ReservationId);
            }
            else
            {
                Log.Error("Failed to send reservation confirmation SMS for Reservation: {ReservationId}", reservedEvent.ReservationId);
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error processing VehicleReservedEvent");
        }
    }
}
