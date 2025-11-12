using System;
using System.ComponentModel.DataAnnotations;

namespace CustomerService.Models;

public class Complaint
{
    public int Id { get; set; }

    [Required]
    public int CustomerId { get; set; } // Foreign key to Customer

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public string Status { get; set; } = "Open"; // e.g., "Open", "In Progress", "Resolved", "Closed"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }
    public string? Resolution { get; set; }

    // Navigation properties (optional, depending on further requirements)
    public Customer? Customer { get; set; }
}
