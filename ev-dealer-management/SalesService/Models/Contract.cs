using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Contract
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; } // Reference to Order

        [Required]
        [StringLength(100)]
        public string ContractNumber { get; set; } = Guid.NewGuid().ToString(); // Auto-generated or provided

        [StringLength(2000)]
        public string? ContractDetails { get; set; } // e.g., URL to document, or JSON string

        public DateTime SignDate { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // Added UpdatedAt

        // Navigation property
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}
