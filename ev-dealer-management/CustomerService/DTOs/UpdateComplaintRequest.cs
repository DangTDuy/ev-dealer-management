using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs;

public class UpdateComplaintRequest
{
    [StringLength(200)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    [StringLength(50)]
    public string? Status { get; set; } // e.g., "Open", "In Progress", "Resolved", "Closed"

    public string? Resolution { get; set; }
    public DateTime? ResolvedDate { get; set; }
}
