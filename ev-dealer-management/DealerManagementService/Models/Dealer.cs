using System.ComponentModel.DataAnnotations;

namespace DealerManagementService.Models;

public class Dealer
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Region { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Contact { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Address { get; set; } = string.Empty;

    // Additional fields for sales integration
    public decimal? SalesTarget { get; set; }
    public decimal? OutstandingDebt { get; set; }
    public string? Status { get; set; } = "Active"; // Active, Inactive, Suspended

    // Audit fields
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

