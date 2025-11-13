using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs
{
    public class CreateComplaintRequest
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;
    }
}