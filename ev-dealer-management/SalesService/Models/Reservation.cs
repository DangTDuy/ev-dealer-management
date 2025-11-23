using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string CustomerPhone { get; set; } = string.Empty;

        [Required]
        public int Quantity { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }

        // Optional: Add other properties if needed for SalesService's view of a reservation
        public int VehicleId { get; set; }
        public int DealerId { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
