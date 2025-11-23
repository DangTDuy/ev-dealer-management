using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; } // Reference to the Order

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = "Cash"; // e.g., Cash, BankTransfer, Installment

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Completed"; // e.g., Completed, Pending, Failed, Refunded

        [StringLength(200)]
        public string? TransactionId { get; set; } // e.g., from payment gateway

        [StringLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}
