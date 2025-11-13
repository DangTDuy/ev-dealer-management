namespace CustomerService.DTOs
{
    public class ComplaintDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? Resolution { get; set; }
        public string? CustomerName { get; set; }
    }
}