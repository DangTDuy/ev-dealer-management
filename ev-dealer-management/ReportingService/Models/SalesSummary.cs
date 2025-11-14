using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ev_dealer_reporting.Models;

/// <summary>
/// Bảng tổng hợp doanh số bán hàng theo ngày, theo nhân viên và đại lý.
/// Dữ liệu này được cập nhật từ các sự kiện của SalesService.
/// </summary>
public class SalesSummary
{
    [Key]
    public Guid Id { get; set; }

    public DateTime Date { get; set; }

    public Guid DealerId { get; set; }
    
    public required string DealerName { get; set; } // Denormalized data

    public required string Region { get; set; } // Miền Bắc, Miền Trung, Miền Nam

    public Guid SalespersonId { get; set; }
    
    public required string SalespersonName { get; set; } // Denormalized data

    public int TotalOrders { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal TotalRevenue { get; set; }
    
    public DateTime LastUpdatedAt { get; set; }
}
