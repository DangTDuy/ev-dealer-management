using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int QuoteId { get; set; } // Reference to Quote

        [Required]
        public int CustomerId { get; set; } // Redundant but useful for quick access

        [Required]
        public int VehicleId { get; set; } // Redundant but useful for quick access

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // e.g., Pending, Confirmed, Shipped, Delivered, Cancelled

        [Required]
        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending"; // e.g., Pending, Paid, PartiallyPaid, Refunded

        [StringLength(50)]
        public string? PaymentMethod { get; set; } // e.g., Cash, Installment

        [StringLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("QuoteId")]
        public Quote? Quote { get; set; }
    }
}
