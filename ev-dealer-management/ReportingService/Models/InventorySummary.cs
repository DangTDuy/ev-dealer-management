using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ev_dealer_reporting.Models;

/// <summary>
/// Bảng tổng hợp tồn kho xe theo từng đại lý.
/// Dữ liệu này được cập nhật từ các sự kiện của VehicleService.
/// </summary>
public class InventorySummary
{
    [Key]
    public Guid Id { get; set; }

    public Guid VehicleId { get; set; }
    
    public required string VehicleName { get; set; } // Denormalized data

    public Guid DealerId { get; set; }
    
    public required string DealerName { get; set; } // Denormalized data

    public int StockCount { get; set; }
    
    public DateTime LastUpdatedAt { get; set; }
}
