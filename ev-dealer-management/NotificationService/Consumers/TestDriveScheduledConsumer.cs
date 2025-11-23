using MassTransit;
using NotificationService.Services;
using Serilog;

namespace NotificationService.Consumers;

// This record needs to be defined here as well to ensure the consumer knows the message contract.
// In a real-world large scale project, this would be in a shared library.
public record TestDriveScheduledEvent
{
    public int TestDriveId { get; init; }
    public string CustomerName { get; init; } = null!;
    public string CustomerEmail { get; init; } = null!;
    public DateTime AppointmentDate { get; init; }
    public int VehicleId { get; init; }
    public string VehicleModel { get; init; } = null!;
}

public class TestDriveScheduledConsumer : IConsumer<TestDriveScheduledEvent>
{
    private readonly IEmailService _emailService;

    public TestDriveScheduledConsumer(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task Consume(ConsumeContext<TestDriveScheduledEvent> context)
    {
        var message = context.Message;
        Log.Information(
            "Received Test Drive Scheduled Event: Customer '{CustomerName}' ({CustomerEmail}) has booked a test drive for vehicle {VehicleModel} on {AppointmentDate}. TestDriveId: {TestDriveId}",
            message.CustomerName,
            message.CustomerEmail,
            message.VehicleModel,
            message.AppointmentDate,
            message.TestDriveId
        );

        var success = await _emailService.SendTestDriveConfirmationAsync(
            message.CustomerEmail,
            message.CustomerName,
            message.VehicleModel,
            message.AppointmentDate
        );

        if (success)
        {
            Log.Information("Test drive confirmation email sent for TestDriveId: {TestDriveId}", message.TestDriveId);
        }
        else
        {
            Log.Error("Failed to send test drive confirmation email for TestDriveId: {TestDriveId}", message.TestDriveId);
        }
    }
}
