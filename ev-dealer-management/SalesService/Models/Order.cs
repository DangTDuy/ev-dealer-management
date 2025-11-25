using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic; // Required for ICollection

namespace SalesService.Models
{
    public class Order
    {
        [Key]
        public int OrderID { get; set; }

        [Required]
        public int QuoteId { get; set; } // Reference to Quote

        [Required]
        public int CustomerId { get; set; }

        public int? DealerId { get; set; } // New: DealerID
        
        // Salesperson handling the order (foreign key to users/staff service)
        // Kept as int so it can reference an external Users/Staff ID.
        public int SalespersonId { get; set; }

        // PaymentType: e.g., "Cash", "BankTransfer"
        [StringLength(50)]
        public string PaymentType { get; set; } = string.Empty;

        // Removed VehicleId and Quantity as they will be in OrderItem

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // e.g., Pending, Confirmed, Shipped, Delivered, Cancelled

        [Required]
        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending"; // e.g., Pending, Paid, PartiallyPaid, Refunded

        [Required] // Changed to Required as per new requirement
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // New: e.g., Cash, Bank transfer, Financing via bank

        [Required] // New: Preferred Delivery Date
        public DateTime DeliveryDate { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // OrderNumber: human-facing order code shown to user (unique)
        [StringLength(50)]
        public string? OrderNumber { get; set; }

        // Navigation property
        [ForeignKey("QuoteId")]
        public Quote? Quote { get; set; }

        // New: Navigation property for OrderItems
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
