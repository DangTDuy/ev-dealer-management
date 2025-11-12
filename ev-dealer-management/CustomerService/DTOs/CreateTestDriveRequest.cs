using System;
using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs;

public class CreateTestDriveRequest
{
    [Required]
    public int VehicleId { get; set; } // Assuming this ID is sufficient

    [Required]
    public int DealerId { get; set; }     // Assuming this ID is sufficient

    [Required]
    public DateTime AppointmentDate { get; set; }

    public string? Notes { get; set; }
    public string? Status { get; set; }
}
