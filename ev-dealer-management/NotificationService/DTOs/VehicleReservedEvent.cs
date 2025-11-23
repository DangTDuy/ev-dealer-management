namespace NotificationService.DTOs;

public class VehicleReservedEvent
{
    public required string ReservationId { get; set; }
    public required string CustomerPhone { get; set; }
    public required string CustomerName { get; set; }
    public required string VehicleModel { get; set; }
    public required string ColorName { get; set; }
    public DateTime ReservedAt { get; set; }
}
