using System.ComponentModel.DataAnnotations;

namespace VehicleService.Models;

public class Reservation
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    public int? ColorVariantId { get; set; }
    public ColorVariant? ColorVariant { get; set; }

    [Required]
    [StringLength(100)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string CustomerPhone { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Notes { get; set; }

    [Required]
    [Range(1, 10)]
    public int Quantity { get; set; } = 1;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal TotalPrice { get; set; }

    [Required]
    [StringLength(20)]
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Expires after 48 hours by default
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(48);
}

public enum ReservationStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Expired
}