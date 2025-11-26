using ev_dealer_reporting.Data;
using ev_dealer_reporting.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ev_dealer_reporting.Services;

public interface IReportService
{
    Task<DealerSalesReportDto> GetDealerSalesReportAsync(int dealerId, string period, DateTime? fromDate, DateTime? toDate);
    Task<DealerDebtReportDto> GetDealerDebtReportAsync(int dealerId);
    Task<TotalSalesDashboardDto> GetTotalSalesDashboardAsync(DateTime? fromDate, DateTime? toDate);
    Task<InventoryAnalysisDto> GetInventoryAnalysisAsync();
}

public class ReportService : IReportService
{
    private readonly ISalesDataService _salesDataService;
    private readonly IVehicleDataService _vehicleDataService;
    private readonly ReportingDbContext _db;
    private readonly ILogger<ReportService> _logger;

    public ReportService(
        ISalesDataService salesDataService,
        IVehicleDataService vehicleDataService,
        ReportingDbContext db,
        ILogger<ReportService> logger)
    {
        _salesDataService = salesDataService;
        _vehicleDataService = vehicleDataService;
        _db = db;
        _logger = logger;
    }

    public async Task<DealerSalesReportDto> GetDealerSalesReportAsync(int dealerId, string period, DateTime? fromDate, DateTime? toDate)
    {
        // Get dealer info
        var dealers = await _vehicleDataService.GetDealersAsync();
        var dealer = dealers.FirstOrDefault(d => d.Id == dealerId);
        
        // Get orders from SalesService
        var orders = await _salesDataService.GetOrdersAsync(fromDate, toDate, dealerId);
        
        // Group by period
        var salesByPeriod = new List<SalesByPeriodDto>();
        
        if (period.ToLower() == "day")
        {
            salesByPeriod = orders
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new SalesByPeriodDto
                {
                    PeriodLabel = g.Key.ToString("yyyy-MM-dd"),
                    PeriodDate = g.Key,
                    VehiclesSold = g.Sum(o => o.Quantity),
                    Revenue = g.Sum(o => o.TotalPrice)
                })
                .OrderBy(s => s.PeriodDate)
                .ToList();
        }
        else if (period.ToLower() == "month")
        {
            salesByPeriod = orders
                .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
                .Select(g => new SalesByPeriodDto
                {
                    PeriodLabel = $"{g.Key.Year}-{g.Key.Month:D2}",
                    PeriodDate = new DateTime(g.Key.Year, g.Key.Month, 1),
                    VehiclesSold = g.Sum(o => o.Quantity),
                    Revenue = g.Sum(o => o.TotalPrice)
                })
                .OrderBy(s => s.PeriodDate)
                .ToList();
        }
        else if (period.ToLower() == "year")
        {
            salesByPeriod = orders
                .GroupBy(o => o.CreatedAt.Year)
                .Select(g => new SalesByPeriodDto
                {
                    PeriodLabel = g.Key.ToString(),
                    PeriodDate = new DateTime(g.Key, 1, 1),
                    VehiclesSold = g.Sum(o => o.Quantity),
                    Revenue = g.Sum(o => o.TotalPrice)
                })
                .OrderBy(s => s.PeriodDate)
                .ToList();
        }

        return new DealerSalesReportDto
        {
            DealerId = Guid.Empty, // Will be converted from int
            DealerName = dealer?.Name ?? $"Dealer {dealerId}",
            Period = period,
            FromDate = fromDate,
            ToDate = toDate,
            TotalVehiclesSold = orders.Sum(o => o.Quantity),
            TotalRevenue = orders.Sum(o => o.TotalPrice),
            SalesByPeriod = salesByPeriod
        };
    }

    public async Task<DealerDebtReportDto> GetDealerDebtReportAsync(int dealerId)
    {
        // Get dealer info
        var dealers = await _vehicleDataService.GetDealersAsync();
        var dealer = dealers.FirstOrDefault(d => d.Id == dealerId);
        
        // Get all orders for this dealer
        var orders = await _salesDataService.GetOrdersAsync(null, null, dealerId);
        
        // Get all payments
        var allPayments = await _salesDataService.GetPaymentsAsync();
        
        // Calculate debt to manufacturer (orders where dealer bought from manufacturer)
        // For now, we'll assume all orders are dealer purchases from manufacturer
        // In a real system, you'd have a separate table for dealer purchases
        // Note: Payment.OrderId is Guid, but Order.OrderId is int, so we need to match differently
        // For now, we'll calculate based on orders without matching payments (simplified)
        var debtToManufacturerDetails = orders
            .Select(o => new DebtToManufacturerDto
            {
                OrderId = Guid.Empty, // Convert from int - would need mapping table in real system
                OrderNumber = o.OrderNumber,
                OrderDate = o.CreatedAt,
                OrderAmount = o.TotalPrice,
                PaidAmount = 0, // Simplified - would need proper payment matching
                RemainingDebt = o.TotalPrice, // Simplified - assume all unpaid
                Status = o.Status
            })
            .Where(d => d.Status != "Paid" && d.Status != "Completed")
            .ToList();
        
        var debtToManufacturer = debtToManufacturerDetails.Sum(d => d.RemainingDebt);
        
        // Calculate debt from customers (installment orders)
        var installmentOrders = orders.Where(o => o.PaymentMethod == "Trả góp" || o.LoanTermMonths.HasValue);
        
        var debtFromCustomerDetails = installmentOrders
            .Select(o => new DebtFromCustomerDto
            {
                OrderId = Guid.Empty, // Convert from int
                OrderNumber = o.OrderNumber,
                CustomerId = o.CustomerId,
                CustomerName = "Customer", // Would need to fetch from CustomerService
                OrderDate = o.CreatedAt,
                TotalAmount = o.TotalPrice,
                PaidAmount = o.DepositAmount ?? 0, // Simplified - use deposit as paid amount
                RemainingDebt = o.TotalPrice - (o.DepositAmount ?? 0),
                LoanTermMonths = o.LoanTermMonths,
                MonthlyPayment = CalculateMonthlyPayment(o.TotalPrice, o.DepositAmount ?? 0, o.LoanTermMonths ?? 0, o.InterestRateYearly ?? 0),
                Status = o.Status
            })
            .Where(d => d.RemainingDebt > 0)
            .ToList();
        
        var debtFromCustomers = debtFromCustomerDetails.Sum(d => d.RemainingDebt);
        
        return new DealerDebtReportDto
        {
            DealerId = Guid.Empty, // Convert from int
            DealerName = dealer?.Name ?? $"Dealer {dealerId}",
            ReportDate = DateTime.UtcNow,
            DebtToManufacturer = debtToManufacturer,
            DebtToManufacturerDetails = debtToManufacturerDetails,
            DebtFromCustomers = debtFromCustomers,
            DebtFromCustomerDetails = debtFromCustomerDetails,
            TotalDebt = debtToManufacturer - debtFromCustomers // Net debt
        };
    }

    public async Task<TotalSalesDashboardDto> GetTotalSalesDashboardAsync(DateTime? fromDate, DateTime? toDate)
    {
        // Get all orders
        var orders = await _salesDataService.GetOrdersAsync(fromDate, toDate);
        
        // Get dealers for region mapping
        var dealers = await _vehicleDataService.GetDealersAsync();
        
        // Get sales summaries from database (aggregated data)
        var salesQuery = _db.SalesSummaries.AsQueryable();
        if (fromDate.HasValue)
            salesQuery = salesQuery.Where(s => s.Date >= fromDate.Value);
        if (toDate.HasValue)
            salesQuery = salesQuery.Where(s => s.Date <= toDate.Value);
        
        var salesSummaries = await salesQuery.ToListAsync();
        
        // Group by region
        var salesByRegion = salesSummaries
            .GroupBy(s => s.Region)
            .Select(g => new SalesByRegionDto
            {
                Region = g.Key,
                VehiclesSold = g.Sum(s => s.TotalOrders),
                Revenue = g.Sum(s => s.TotalRevenue),
                DealerCount = g.Select(s => s.DealerId).Distinct().Count(),
                RevenuePercentage = 0 // Will calculate below
            })
            .ToList();
        
        var totalRevenue = salesByRegion.Sum(s => (double)s.Revenue);
        foreach (var region in salesByRegion)
        {
            region.RevenuePercentage = totalRevenue > 0 ? (double)region.Revenue / totalRevenue * 100 : 0;
        }
        
        // Create heatmap data
        var heatmapData = salesSummaries
            .GroupBy(s => new { s.Region, s.DealerId, s.DealerName })
            .Select(g => new SalesHeatmapDataDto
            {
                Region = g.Key.Region,
                DealerName = g.Key.DealerName,
                DealerId = g.Key.DealerId,
                VehiclesSold = g.Sum(s => s.TotalOrders),
                Revenue = g.Sum(s => s.TotalRevenue),
                HeatLevel = CalculateHeatLevel(g.Sum(s => (double)s.TotalRevenue), totalRevenue)
            })
            .ToList();
        
        return new TotalSalesDashboardDto
        {
            ReportDate = DateTime.UtcNow,
            FromDate = fromDate,
            ToDate = toDate,
            TotalVehiclesSold = salesByRegion.Sum(s => s.VehiclesSold),
            TotalRevenue = salesByRegion.Sum(s => s.Revenue),
            SalesByRegion = salesByRegion.OrderByDescending(s => s.Revenue).ToList(),
            HeatmapData = heatmapData
        };
    }

    public async Task<InventoryAnalysisDto> GetInventoryAnalysisAsync()
    {
        // Get vehicles from VehicleService
        var vehicles = await _vehicleDataService.GetVehiclesAsync();
        
        // Get sales data for last 12 months to calculate turnover
        var twelveMonthsAgo = DateTime.UtcNow.AddMonths(-12);
        var orders = await _salesDataService.GetOrdersAsync(twelveMonthsAgo, DateTime.UtcNow);
        
        // Get dealers for region mapping
        var dealers = await _vehicleDataService.GetDealersAsync();
        
        // Calculate inventory turnover for each vehicle
        var inventoryTurnover = vehicles.Select(v =>
        {
            var vehicleOrders = orders.Where(o => o.VehicleId == v.Id).ToList();
            var monthlySales = vehicleOrders.Count > 0 ? vehicleOrders.Sum(o => o.Quantity) / 12.0 : 0;
            var turnoverRate = v.StockQuantity > 0 ? (monthlySales * 12) / v.StockQuantity : 0;
            var daysInStock = monthlySales > 0 ? (int)(v.StockQuantity / monthlySales * 30) : int.MaxValue;
            
            var dealer = dealers.FirstOrDefault(d => d.Id == v.DealerId);
            
            return new InventoryTurnoverDto
            {
                VehicleId = Guid.Empty, // Convert from int
                VehicleName = v.Model,
                DealerId = Guid.Empty, // Convert from int
                DealerName = v.DealerName,
                Region = dealer?.Region ?? "Unknown",
                CurrentStock = v.StockQuantity,
                AverageMonthlySales = (int)Math.Round(monthlySales),
                TurnoverRate = Math.Round(turnoverRate, 2),
                DaysInStock = daysInStock,
                Status = GetInventoryStatus(turnoverRate, daysInStock)
            };
        }).ToList();
        
        // Identify slow-moving inventory
        var slowMovingInventory = inventoryTurnover
            .Where(i => i.DaysInStock > 90)
            .Select(i => new SlowMovingInventoryDto
            {
                VehicleId = i.VehicleId,
                VehicleName = i.VehicleName,
                DealerId = i.DealerId,
                DealerName = i.DealerName,
                Region = i.Region,
                StockCount = i.CurrentStock,
                DaysInStock = i.DaysInStock,
                FirstStockDate = DateTime.UtcNow.AddDays(-i.DaysInStock), // Approximation
                AlertLevel = i.DaysInStock > 180 ? "critical" : "warning",
                Recommendation = i.DaysInStock > 180 
                    ? "Ngưng sản xuất hoặc giảm giá xả hàng" 
                    : "Theo dõi và xem xét giảm giá"
            })
            .OrderByDescending(s => s.DaysInStock)
            .ToList();
        
        return new InventoryAnalysisDto
        {
            ReportDate = DateTime.UtcNow,
            InventoryTurnover = inventoryTurnover.OrderByDescending(i => i.DaysInStock).ToList(),
            SlowMovingInventory = slowMovingInventory
        };
    }

    private decimal CalculateMonthlyPayment(decimal totalAmount, decimal depositAmount, int loanTermMonths, decimal interestRateYearly)
    {
        if (loanTermMonths <= 0) return 0;
        
        var loanAmount = totalAmount - depositAmount;
        if (loanAmount <= 0) return 0;
        
        var monthlyRate = interestRateYearly / 100 / 12;
        if (monthlyRate == 0)
            return loanAmount / loanTermMonths;
        
        var monthlyPayment = loanAmount * (monthlyRate * (decimal)Math.Pow(1 + (double)monthlyRate, loanTermMonths)) 
            / ((decimal)Math.Pow(1 + (double)monthlyRate, loanTermMonths) - 1);
        
        return monthlyPayment;
    }

    private string CalculateHeatLevel(double revenue, double totalRevenue)
    {
        if (totalRevenue == 0) return "low";
        var percentage = revenue / totalRevenue * 100;
        if (percentage >= 20) return "high";
        if (percentage >= 10) return "medium";
        return "low";
    }

    private string GetInventoryStatus(double turnoverRate, int daysInStock)
    {
        if (turnoverRate >= 6 || daysInStock <= 60) return "healthy";
        if (turnoverRate >= 3 || daysInStock <= 120) return "warning";
        return "critical";
    }
}

