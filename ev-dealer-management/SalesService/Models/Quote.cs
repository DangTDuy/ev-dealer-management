using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Quote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; } // Reference to CustomerService

        [Required]
        public int VehicleId { get; set; } // Reference to VehicleService

        public int? ColorVariantId { get; set; } // Reference to VehicleService

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // e.g., Pending, Accepted, Rejected

        [StringLength(1000)]
        public string? Notes { get; set; }

        // New payment-related fields for Quote
        [Required]
        [StringLength(50)]
        public string PaymentType { get; set; } = "Full"; // e.g., Full, Installment

        [Column(TypeName = "decimal(5, 2)")] // Max 999.99, 2 decimal places
        public decimal? DownPaymentPercent { get; set; } // Only for Installment

        public int? LoanTerm { get; set; } // In months, only for Installment

        [Column(TypeName = "decimal(5, 2)")] // Max 999.99, 2 decimal places
        public decimal? InterestRate { get; set; } // Only for Installment

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
