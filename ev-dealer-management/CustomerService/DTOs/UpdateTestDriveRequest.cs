using System;
using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs;

public class UpdateTestDriveRequest
{
    public DateTime? AppointmentDate { get; set; }

    [StringLength(50)]
    public string? Status { get; set; } // e.g., Scheduled, Completed, Canceled

    public string? Notes { get; set; }
}
