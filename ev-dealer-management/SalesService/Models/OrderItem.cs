using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class OrderItem
    {
        [Key]
        public int OrderItemID { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int VehicleId { get; set; } // Reference to Vehicle model

        public int? ColorVariantId { get; set; } // Reference to ColorVariant if applicable

        // New fields to better reflect the domain: separate model/variant/color ids
        public int? VehicleModelId { get; set; }
        public int? VehicleVariantId { get; set; }
        public int? ColorId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; } // Price at the time of order creation

        [Column(TypeName = "decimal(5, 2)")]
        public decimal? Discount { get; set; } // Percentage discount

        [StringLength(200)]
        public string? PromotionApplied { get; set; } // Name or code of promotion

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}
