using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models;

[Table("ProcessedReservations")]
public class ProcessedReservation
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int ReservationId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(200)]
    public string AssignedStaff { get; set; } = string.Empty;

    [Required]
    public DateTime ProcessedAt { get; set; }

    public int DealerReservationId { get; set; }

    // Additional fields from Dealer Service
    [MaxLength(50)]
    public string? VehicleId { get; set; }

    public int? DealerId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // Added UpdatedAt
}
