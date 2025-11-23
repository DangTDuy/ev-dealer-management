using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Delivery
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; } // Reference to the Order

        [Required]
        [StringLength(100)]
        public string TrackingNumber { get; set; } = string.Empty;

        [Required]
        public DateTime EstimatedDeliveryDate { get; set; }

        public DateTime? ActualDeliveryDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // e.g., Pending, Shipped, InTransit, Delivered, Delayed, Cancelled

        [StringLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}
