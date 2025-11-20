namespace VehicleService.DTOs
{
    public class VehicleCreatedEvent
    {
        public int VehicleId { get; set; }
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DealerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class VehicleUpdatedEvent
    {
        public int VehicleId { get; set; }
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DealerId { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class VehicleDeletedEvent
    {
        public int VehicleId { get; set; }
        public DateTime DeletedAt { get; set; }
    }

    public class VehicleReservedEvent
    {
        public int ReservationId { get; set; }
        public int VehicleId { get; set; }
        public string VehicleModel { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public int? ColorVariantId { get; set; }
        public string? ColorVariantName { get; set; }
        public int DealerId { get; set; }  // Thêm DealerId để tạo customer
        public DateTime CreatedAt { get; set; }
    }
}
