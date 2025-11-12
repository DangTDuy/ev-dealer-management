using System;
using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs;

public class CreateComplaintRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    // Status is usually set by the system upon creation (e.g., "Open")
    // public string Status { get; set; } = "Open";
}
