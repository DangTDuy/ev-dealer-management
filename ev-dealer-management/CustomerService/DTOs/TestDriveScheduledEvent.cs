namespace CustomerService.DTOs;

public class TestDriveScheduledEvent
{
    public required string CustomerEmail { get; set; }
    public required string CustomerName { get; set; }
    public required string VehicleModel { get; set; }
    public DateTime ScheduledDate { get; set; }
}
