namespace CustomerService.DTOs;

public class TestDriveDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int VehicleId { get; set; } // Assuming this ID is sufficient, or might need more vehicle details
    public int DealerId { get; set; }     // Assuming this ID is sufficient, or might need more dealer details
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
