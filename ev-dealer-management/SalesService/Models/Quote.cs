using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Quote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int VehicleId { get; set; }

        public int? ColorVariantId { get; set; }

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
        public string Status { get; set; } = "Finalized"; // Changed default status to Finalized

        [Required]
        public int SalesRepId { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // Removed UpdatedAt as per user request

        // New payment fields as expected by SalesController
        [StringLength(50)]
        public string? PaymentType { get; set; }
        
        [Column(TypeName = "decimal(5, 2)")]
        public decimal? DownPaymentPercent { get; set; }

        public int? LoanTerm { get; set; }
        
        [Column(TypeName = "decimal(5, 2)")]
        public decimal? InterestRate { get; set; }
    }
}
