using ev_dealer_reporting.DTOs;

namespace ev_dealer_reporting.Services;

/// <summary>
/// Service để fetch dữ liệu từ SalesService
/// </summary>
public interface ISalesDataService
{
    Task<List<OrderDataDto>> GetOrdersAsync(DateTime? fromDate, DateTime? toDate, int? dealerId = null);
    Task<List<PaymentDataDto>> GetPaymentsAsync(DateTime? fromDate, DateTime? toDate, Guid? orderId = null);
    Task<OrderDataDto?> GetOrderByIdAsync(int orderId);
}

public class OrderDataDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int DealerId { get; set; }
    public int SalespersonId { get; set; }
    public int CustomerId { get; set; }
    public int VehicleId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public string PaymentMethod { get; set; } = string.Empty; // "Trả thẳng" or "Trả góp"
    public decimal? DepositAmount { get; set; }
    public int? LoanTermMonths { get; set; }
    public decimal? InterestRateYearly { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class PaymentDataDto
{
    public Guid PaymentId { get; set; }
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? PaidDate { get; set; }
    public DateTime CreatedAt { get; set; }
}


