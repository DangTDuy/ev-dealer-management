using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Promotion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal DiscountValue { get; set; } // e.g., percentage or fixed amount

        [Required]
        [StringLength(50)]
        public string DiscountType { get; set; } = "Percentage"; // e.g., Percentage, FixedAmount

        [StringLength(50)]
        public string? ApplicableTo { get; set; } // e.g., "All", "Vehicles", "SpecificVehicleId:X"

        public int? VehicleId { get; set; } // If ApplicableTo is SpecificVehicleId

        [Required]
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
