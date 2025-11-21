namespace DealerManagementService.Models
{
    public class ReservationEventDto
    {
        public int ReservationId { get; set; }
        public string VehicleId { get; set; } = string.Empty;
        public int DealerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

