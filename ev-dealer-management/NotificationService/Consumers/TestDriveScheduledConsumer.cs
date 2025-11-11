using MassTransit;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

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
}

public class TestDriveScheduledConsumer : IConsumer<TestDriveScheduledEvent>
{
    private readonly ILogger<TestDriveScheduledConsumer> _logger;

    public TestDriveScheduledConsumer(ILogger<TestDriveScheduledConsumer> logger)
    {
        _logger = logger;
    }

    public Task Consume(ConsumeContext<TestDriveScheduledEvent> context)
    {
        var message = context.Message;
        _logger.LogInformation(
            "Received Test Drive Scheduled Event: Customer '{CustomerName}' ({CustomerEmail}) has booked a test drive for vehicle {VehicleId} on {AppointmentDate}. TestDriveId: {TestDriveId}",
            message.CustomerName,
            message.CustomerEmail,
            message.VehicleId,
            message.AppointmentDate,
            message.TestDriveId
        );

        // In a real application, you would add logic here to send an email, SMS, or push notification.
        // For example: await _emailService.SendTestDriveConfirmationEmail(message);

        return Task.CompletedTask;
    }
}
