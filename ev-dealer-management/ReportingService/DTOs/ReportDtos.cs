namespace ev_dealer_reporting.DTOs;

/// <summary>
/// Báo cáo Doanh số (Dealer Portal) - Doanh thu thực tế, số lượng xe bán ra theo ngày/tháng/năm
/// </summary>
public class DealerSalesReportDto
{
    public Guid DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty; // "day", "month", "year"
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int TotalVehiclesSold { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<SalesByPeriodDto> SalesByPeriod { get; set; } = new();
}

public class SalesByPeriodDto
{
    public string PeriodLabel { get; set; } = string.Empty; // "2025-01-15", "2025-01", "2025"
    public DateTime PeriodDate { get; set; }
    public int VehiclesSold { get; set; }
    public decimal Revenue { get; set; }
}

/// <summary>
/// Báo cáo Công nợ (Dealer Portal) - Công nợ mua xe từ hãng và công nợ trả góp từ khách hàng
/// </summary>
public class DealerDebtReportDto
{
    public Guid DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public DateTime ReportDate { get; set; }
    
    // Công nợ đại lý nợ hãng (mua xe)
    public decimal DebtToManufacturer { get; set; }
    public List<DebtToManufacturerDto> DebtToManufacturerDetails { get; set; } = new();
    
    // Công nợ khách hàng nợ đại lý (trả góp)
    public decimal DebtFromCustomers { get; set; }
    public List<DebtFromCustomerDto> DebtFromCustomerDetails { get; set; } = new();
    
    public decimal TotalDebt { get; set; } // Tổng công nợ (có thể âm nếu đại lý được nợ nhiều hơn)
}

public class DebtToManufacturerDto
{
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal OrderAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingDebt { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class DebtFromCustomerDto
{
    public Guid OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingDebt { get; set; }
    public int? LoanTermMonths { get; set; }
    public decimal? MonthlyPayment { get; set; }
    public string Status { get; set; } = string.Empty;
}

/// <summary>
/// Dashboard Doanh số tổng (EVM Portal) - Heatmap doanh số theo vùng miền
/// </summary>
public class TotalSalesDashboardDto
{
    public DateTime ReportDate { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int TotalVehiclesSold { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<SalesByRegionDto> SalesByRegion { get; set; } = new();
    public List<SalesHeatmapDataDto> HeatmapData { get; set; } = new();
}

public class SalesByRegionDto
{
    public string Region { get; set; } = string.Empty; // "Miền Bắc", "Miền Trung", "Miền Nam"
    public int VehiclesSold { get; set; }
    public decimal Revenue { get; set; }
    public int DealerCount { get; set; }
    public double RevenuePercentage { get; set; }
}

public class SalesHeatmapDataDto
{
    public string Region { get; set; } = string.Empty;
    public string DealerName { get; set; } = string.Empty;
    public Guid DealerId { get; set; }
    public int VehiclesSold { get; set; }
    public decimal Revenue { get; set; }
    public string HeatLevel { get; set; } = string.Empty; // "high", "medium", "low"
}

/// <summary>
/// Phân tích Tồn kho & Tốc độ tiêu thụ (Inventory Turnover)
/// </summary>
public class InventoryAnalysisDto
{
    public DateTime ReportDate { get; set; }
    public List<InventoryTurnoverDto> InventoryTurnover { get; set; } = new();
    public List<SlowMovingInventoryDto> SlowMovingInventory { get; set; } = new();
}

public class InventoryTurnoverDto
{
    public Guid VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public Guid DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int AverageMonthlySales { get; set; }
    public double TurnoverRate { get; set; } // Số lần quay vòng trong năm
    public int DaysInStock { get; set; } // Số ngày trung bình trong kho
    public string Status { get; set; } = string.Empty; // "healthy", "warning", "critical"
}

public class SlowMovingInventoryDto
{
    public Guid VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public Guid DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public int StockCount { get; set; }
    public int DaysInStock { get; set; }
    public DateTime FirstStockDate { get; set; }
    public string AlertLevel { get; set; } = string.Empty; // "warning" (>90 days), "critical" (>180 days)
    public string Recommendation { get; set; } = string.Empty;
}


