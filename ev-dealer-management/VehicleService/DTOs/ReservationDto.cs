using System.ComponentModel.DataAnnotations;
using VehicleService.Models;

namespace VehicleService.DTOs;

public class ReservationDto
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public int? ColorVariantId { get; set; }
    public string? ColorVariantName { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public class CreateReservationDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;

    [Required]
    [StringLength(20, MinimumLength = 10)]
    [Phone]
    public string CustomerPhone { get; set; } = string.Empty;

    public int? ColorVariantId { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }

    [Range(1, 10)]
    public int Quantity { get; set; } = 1;
}

public class ReservationQueryDto
{
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public ReservationStatus? Status { get; set; }
    public int? VehicleId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortOrder { get; set; } = "desc";
}

public class UpdateReservationStatusDto
{
    [Required]
    public ReservationStatus Status { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
}