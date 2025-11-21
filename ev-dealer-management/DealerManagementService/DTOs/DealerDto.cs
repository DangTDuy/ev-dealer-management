using System.ComponentModel.DataAnnotations;

namespace DealerManagementService.DTOs;

public class DealerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal? SalesTarget { get; set; }
    public decimal? OutstandingDebt { get; set; }
    public string? Status { get; set; }
    public int VehicleCount { get; set; } // Will be populated from VehicleService if needed
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateDealerDto
{
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

    public decimal? SalesTarget { get; set; }
    public string? Status { get; set; } = "Active";
}

public class UpdateDealerDto
{
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

    public decimal? SalesTarget { get; set; }
    public decimal? OutstandingDebt { get; set; }
    public string? Status { get; set; }
}

