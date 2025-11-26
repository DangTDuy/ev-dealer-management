using System.Net.Http.Json;
using System.Text.Json;
using ev_dealer_reporting.DTOs;
using Microsoft.Extensions.Configuration;

namespace ev_dealer_reporting.Services;

public class SalesDataService : ISalesDataService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SalesDataService> _logger;

    public SalesDataService(HttpClient httpClient, IConfiguration configuration, ILogger<SalesDataService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        
        var salesServiceUrl = _configuration["Services:SalesService"] ?? "http://localhost:5003";
        _httpClient.BaseAddress = new Uri(salesServiceUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(30);
    }

    public async Task<List<OrderDataDto>> GetOrdersAsync(DateTime? fromDate, DateTime? toDate, int? dealerId = null)
    {
        try
        {
            var queryParams = new List<string>();
            if (fromDate.HasValue)
                queryParams.Add($"fromDate={fromDate.Value:yyyy-MM-dd}");
            if (toDate.HasValue)
                queryParams.Add($"toDate={toDate.Value:yyyy-MM-dd}");
            if (dealerId.HasValue)
                queryParams.Add($"dealerId={dealerId.Value}");

            var queryString = queryParams.Any() ? "?" + string.Join("&", queryParams) : "";
            var response = await _httpClient.GetAsync($"/api/sales/orders{queryString}");

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch orders from SalesService: {StatusCode}", response.StatusCode);
                return new List<OrderDataDto>();
            }

            // SalesService returns orders in a different format, we need to map it
            var jsonContent = await response.Content.ReadAsStringAsync();
            var orders = JsonSerializer.Deserialize<List<JsonElement>>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (orders == null) return new List<OrderDataDto>();

            return orders.Select(o => new OrderDataDto
            {
                OrderId = o.TryGetProperty("orderId", out var oid) ? oid.GetInt32() : 0,
                OrderNumber = o.TryGetProperty("orderNumber", out var on) ? on.GetString() ?? "" : "",
                DealerId = o.TryGetProperty("dealerId", out var did) ? did.GetInt32() : 0,
                SalespersonId = o.TryGetProperty("salespersonId", out var sid) ? sid.GetInt32() : 0,
                CustomerId = o.TryGetProperty("customerId", out var cid) ? cid.GetInt32() : 0,
                VehicleId = o.TryGetProperty("vehicleId", out var vid) ? vid.GetInt32() : 0,
                Quantity = o.TryGetProperty("quantity", out var qty) ? qty.GetInt32() : 0,
                TotalPrice = o.TryGetProperty("totalPrice", out var tp) ? tp.GetDecimal() : 0,
                PaymentMethod = o.TryGetProperty("paymentMethod", out var pm) ? pm.GetString() ?? "" : "",
                DepositAmount = o.TryGetProperty("depositAmount", out var da) && da.ValueKind != JsonValueKind.Null ? da.GetDecimal() : null,
                LoanTermMonths = o.TryGetProperty("loanTermMonths", out var ltm) && ltm.ValueKind != JsonValueKind.Null ? ltm.GetInt32() : null,
                InterestRateYearly = o.TryGetProperty("interestRateYearly", out var iry) && iry.ValueKind != JsonValueKind.Null ? iry.GetDecimal() : null,
                Status = o.TryGetProperty("status", out var st) ? st.GetString() ?? "" : "",
                CreatedAt = o.TryGetProperty("createdAt", out var ca) && DateTime.TryParse(ca.GetString(), out var dt) ? dt : DateTime.UtcNow
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching orders from SalesService");
            return new List<OrderDataDto>();
        }
    }

    public async Task<List<PaymentDataDto>> GetPaymentsAsync(DateTime? fromDate, DateTime? toDate, Guid? orderId = null)
    {
        try
        {
            var queryParams = new List<string>();
            if (fromDate.HasValue)
                queryParams.Add($"fromDate={fromDate.Value:yyyy-MM-dd}");
            if (toDate.HasValue)
                queryParams.Add($"toDate={toDate.Value:yyyy-MM-dd}");
            if (orderId.HasValue)
                queryParams.Add($"orderId={orderId.Value}");

            var queryString = queryParams.Any() ? "?" + string.Join("&", queryParams) : "";
            var response = await _httpClient.GetAsync($"/api/payments{queryString}");

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch payments from SalesService: {StatusCode}", response.StatusCode);
                return new List<PaymentDataDto>();
            }

            var jsonContent = await response.Content.ReadAsStringAsync();
            var payments = JsonSerializer.Deserialize<List<JsonElement>>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (payments == null) return new List<PaymentDataDto>();

            return payments.Select(p => new PaymentDataDto
            {
                PaymentId = p.TryGetProperty("id", out var pid) && Guid.TryParse(pid.GetString(), out var gid) ? gid : Guid.Empty,
                OrderId = p.TryGetProperty("orderId", out var oid) && Guid.TryParse(oid.GetString(), out var ogid) ? ogid : Guid.Empty,
                Amount = p.TryGetProperty("amount", out var amt) ? amt.GetDecimal() : 0,
                Method = p.TryGetProperty("paymentMethod", out var meth) ? meth.GetString() ?? "" : "",
                Status = p.TryGetProperty("status", out var st) ? st.GetString() ?? "" : "",
                PaidDate = p.TryGetProperty("paymentDate", out var pd) && DateTime.TryParse(pd.GetString(), out var pdt) ? pdt : null,
                CreatedAt = p.TryGetProperty("createdAt", out var ca) && DateTime.TryParse(ca.GetString(), out var cdt) ? cdt : DateTime.UtcNow
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching payments from SalesService");
            return new List<PaymentDataDto>();
        }
    }

    public async Task<OrderDataDto?> GetOrderByIdAsync(int orderId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/sales/orders/{orderId}");
            if (!response.IsSuccessStatusCode)
                return null;

            var jsonContent = await response.Content.ReadAsStringAsync();
            var order = JsonSerializer.Deserialize<JsonElement>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (order.ValueKind == JsonValueKind.Null) return null;

            return new OrderDataDto
            {
                OrderId = order.TryGetProperty("orderId", out var oid) ? oid.GetInt32() : 0,
                OrderNumber = order.TryGetProperty("orderNumber", out var on) ? on.GetString() ?? "" : "",
                DealerId = order.TryGetProperty("dealerId", out var did) ? did.GetInt32() : 0,
                SalespersonId = order.TryGetProperty("salespersonId", out var sid) ? sid.GetInt32() : 0,
                CustomerId = order.TryGetProperty("customerId", out var cid) ? cid.GetInt32() : 0,
                VehicleId = order.TryGetProperty("vehicleId", out var vid) ? vid.GetInt32() : 0,
                Quantity = order.TryGetProperty("quantity", out var qty) ? qty.GetInt32() : 0,
                TotalPrice = order.TryGetProperty("totalPrice", out var tp) ? tp.GetDecimal() : 0,
                PaymentMethod = order.TryGetProperty("paymentMethod", out var pm) ? pm.GetString() ?? "" : "",
                DepositAmount = order.TryGetProperty("depositAmount", out var da) && da.ValueKind != JsonValueKind.Null ? da.GetDecimal() : null,
                LoanTermMonths = order.TryGetProperty("loanTermMonths", out var ltm) && ltm.ValueKind != JsonValueKind.Null ? ltm.GetInt32() : null,
                InterestRateYearly = order.TryGetProperty("interestRateYearly", out var iry) && iry.ValueKind != JsonValueKind.Null ? iry.GetDecimal() : null,
                Status = order.TryGetProperty("status", out var st) ? st.GetString() ?? "" : "",
                CreatedAt = order.TryGetProperty("createdAt", out var ca) && DateTime.TryParse(ca.GetString(), out var dt) ? dt : DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching order {OrderId} from SalesService", orderId);
            return null;
        }
    }
}


