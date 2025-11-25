using Microsoft.AspNetCore.Mvc;
using SalesService.DTOs;
using SalesService.Models;
using SalesService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuestPDF.Fluent; // Add this using directive
using SalesService.PdfDocuments; // Add this using directive
using System.Net.Http;
using System.Text.Json;

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly SalesDbContext _context;
        private readonly ILogger<SalesController> _logger;

        // Helper to get current time in Vietnam timezone
        private DateTime GetVietnamNow()
        {
            var utcNow = DateTime.UtcNow;
            // Try Windows ID first, then IANA
            TimeZoneInfo? tz = null; // Changed to nullable
            try
            {
                tz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            }
            catch
            {
                try
                {
                    tz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
                }
                catch
                {
                    // fallback to UTC
                    tz = TimeZoneInfo.Utc;
                }
            }

            return TimeZoneInfo.ConvertTimeFromUtc(utcNow, tz);
        }

        public SalesController(SalesDbContext context, ILogger<SalesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // --- Quote Endpoints ---
        [HttpPost("quotes")]
        public async Task<IActionResult> CreateQuote([FromBody] CreateQuoteDto createQuoteDto)
        {
            // Try to fetch actual unit price from VehicleService API (via API Gateway)
            decimal unitPrice = 0m;
            try
            {
                using var httpClient = new HttpClient();
                // Adjust URL if API gateway or vehicle service runs on different address
                var vehicleApiUrl = $"http://localhost:5036/api/vehicles/{createQuoteDto.VehicleId}";
                var resp = await httpClient.GetAsync(vehicleApiUrl);
                if (resp.IsSuccessStatusCode)
                {
                    var json = await resp.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(json);
                    var root = doc.RootElement;
                    // Try common property names for price
                    if (root.TryGetProperty("price", out var priceProp) && priceProp.ValueKind == JsonValueKind.Number)
                    {
                        unitPrice = priceProp.GetDecimal();
                    }
                    else if (root.TryGetProperty("Price", out var priceProp2) && priceProp2.ValueKind == JsonValueKind.Number)
                    {
                        unitPrice = priceProp2.GetDecimal();
                    }
                    else if (root.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Object && data.TryGetProperty("price", out var nestedPrice) && nestedPrice.ValueKind == JsonValueKind.Number)
                    {
                        unitPrice = nestedPrice.GetDecimal();
                    }
                    else
                    {
                        _logger.LogWarning("Vehicle API returned JSON but no price field found for VehicleId {VehicleId}", createQuoteDto.VehicleId);
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to fetch vehicle {VehicleId} from VehicleService. Status: {Status}", createQuoteDto.VehicleId, resp.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vehicle price for VehicleId {VehicleId}", createQuoteDto.VehicleId);
            }

            decimal totalPrice = unitPrice * createQuoteDto.Quantity;

            var quote = new Quote
            {
                CustomerId = createQuoteDto.CustomerId,
                VehicleId = createQuoteDto.VehicleId,
                ColorVariantId = createQuoteDto.ColorVariantId,
                Quantity = createQuoteDto.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = totalPrice,
                Notes = createQuoteDto.Notes,
                Status = createQuoteDto.Status ?? "Finalized", // Use status from DTO, default to Finalized if not provided
                SalesRepId = createQuoteDto.SalesRepId,
                CreatedAt = GetVietnamNow(),
                // New payment fields
                PaymentType = createQuoteDto.PaymentType,
                DownPaymentPercent = createQuoteDto.DownPaymentPercent,
                LoanTerm = createQuoteDto.LoanTerm,
                InterestRate = createQuoteDto.InterestRate
            };

            _context.Quotes.Add(quote);
            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Quote created successfully with ID: {QuoteId}", quote.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving quote to database.");
                return StatusCode(500, "Internal server error when saving quote.");
            }

            var quoteDto = new QuoteDto
            {
                Id = quote.Id,
                CustomerId = quote.CustomerId,
                VehicleId = quote.VehicleId,
                ColorVariantId = quote.ColorVariantId,
                Quantity = quote.Quantity,
                UnitPrice = quote.UnitPrice,
                TotalPrice = quote.TotalPrice,
                Status = quote.Status,
                Notes = quote.Notes,
                SalesRepId = quote.SalesRepId,
                CreatedAt = quote.CreatedAt,
                // New payment fields
                PaymentType = quote.PaymentType,
                DownPaymentPercent = quote.DownPaymentPercent,
                LoanTerm = quote.LoanTerm,
                InterestRate = quote.InterestRate
            };

            return CreatedAtAction(nameof(GetQuoteById), new { id = quote.Id }, quoteDto);
        }

        [HttpGet("quotes")]
        public async Task<ActionResult<IEnumerable<QuoteDto>>> GetAllQuotes()
        {
            // Return quotes for common statuses including PendingApproval so manager/staff can see awaiting quotes
            var quotes = await _context.Quotes
                .Where(q => q.Status == "Finalized" || q.Status == "PendingApproval" || q.Status == "ConvertedToOrder" || q.Status == "Cancelled") // Include PendingApproval and Cancelled quotes
                .Select(q => new QuoteDto
                {
                    Id = q.Id,
                    CustomerId = q.CustomerId,
                    VehicleId = q.VehicleId,
                    ColorVariantId = q.ColorVariantId,
                    Quantity = q.Quantity,
                    UnitPrice = q.UnitPrice,
                    TotalPrice = q.TotalPrice,
                    Status = q.Status,
                    Notes = q.Notes,
                    SalesRepId = q.SalesRepId,
                    CreatedAt = q.CreatedAt,
                    // New payment fields
                    PaymentType = q.PaymentType,
                    DownPaymentPercent = q.DownPaymentPercent,
                    LoanTerm = q.LoanTerm,
                    InterestRate = q.InterestRate
                })
                .ToListAsync();

            return Ok(quotes);
        }

        [HttpGet("quotes/{id}")]
        public async Task<IActionResult> GetQuoteById(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);

            if (quote == null)
            {
                return NotFound();
            }

            var quoteDto = new QuoteDto
            {
                Id = quote.Id,
                CustomerId = quote.CustomerId,
                VehicleId = quote.VehicleId,
                ColorVariantId = quote.ColorVariantId,
                Quantity = quote.Quantity,
                UnitPrice = quote.UnitPrice,
                TotalPrice = quote.TotalPrice,
                Status = quote.Status,
                Notes = quote.Notes,
                SalesRepId = quote.SalesRepId,
                CreatedAt = quote.CreatedAt,
                // New payment fields
                PaymentType = quote.PaymentType,
                DownPaymentPercent = quote.DownPaymentPercent,
                LoanTerm = quote.LoanTerm,
                InterestRate = quote.InterestRate
            };

            return Ok(quoteDto);
        }

        [HttpPut("quotes/{id}/status")]
        public async Task<IActionResult> UpdateQuoteStatus(int id, [FromBody] UpdateQuoteStatusDto updateDto) // Changed parameter type
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null)
            {
                return NotFound();
            }

            quote.Status = updateDto.Status; // Use status from DTO
            // Removed quote.UpdatedAt = GetVietnamNow(); as per user request
            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Quote status for ID: {QuoteId} updated to {Status}", id, updateDto.Status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating quote status for ID: {QuoteId}", id);
                return StatusCode(500, "Internal server error when updating quote status.");
            }
            return NoContent();
        }

        // --- Order Endpoints ---
        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            var quote = await _context.Quotes.FindAsync(createOrderDto.QuoteId);
            if (quote == null || quote.Status != "Finalized") // Only allow creating order from Finalized quotes
            {
                return BadRequest("Quote not found or not finalized.");
            }

            // Calculate total price from order items
            decimal calculatedTotalPrice = 0;
            foreach (var itemDto in createOrderDto.OrderItems)
            {
                calculatedTotalPrice += itemDto.UnitPrice * itemDto.Quantity * (1 - (itemDto.Discount ?? 0) / 100);
            }

            var order = new Order
            {
                QuoteId = quote.Id,
                CustomerId = quote.CustomerId,
                SalespersonId = createOrderDto.SalespersonId,
                DealerId = createOrderDto.DealerId, // New field
                TotalPrice = calculatedTotalPrice, // Calculated from order items
                PaymentMethod = createOrderDto.PaymentMethod, // New field
                PaymentType = createOrderDto.PaymentType,
                DeliveryDate = createOrderDto.DeliveryDate, // New field
                Notes = createOrderDto.Notes,
                // OrderNumber will be set below to ensure uniqueness
                OrderNumber = null,
                Status = "Pending",
                PaymentStatus = "Pending",
                CreatedAt = GetVietnamNow(),
                UpdatedAt = GetVietnamNow()
            };

            _context.Orders.Add(order);

            // Add OrderItems
            foreach (var itemDto in createOrderDto.OrderItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    VehicleId = itemDto.VehicleId,
                    VehicleModelId = itemDto.VehicleModelId,
                    VehicleVariantId = itemDto.VehicleVariantId,
                    ColorId = itemDto.ColorId,
                    ColorVariantId = itemDto.ColorVariantId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice,
                    Discount = itemDto.Discount,
                    PromotionApplied = itemDto.PromotionApplied,
                    CreatedAt = GetVietnamNow(),
                    UpdatedAt = GetVietnamNow()
                });
            }

            try
            {
                // Update quote status to "ConvertedToOrder" after successful order creation
                quote.Status = "ConvertedToOrder";

                // Generate unique OrderNumber (human-friendly). Try few times if collision.
                string GenerateCandidate()
                {
                    var now = GetVietnamNow();
                    var rnd = new Random();
                    return $"ORD-{now:yyyyMMddHHmmss}-{rnd.Next(1000, 9999)}";
                }

                string candidate = GenerateCandidate();
                int attempts = 0;
                while (await _context.Orders.AnyAsync(o => o.OrderNumber == candidate))
                {
                    candidate = GenerateCandidate();
                    attempts++;
                    if (attempts > 10) break;
                }
                order.OrderNumber = candidate;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving order or updating quote status for QuoteId: {QuoteId}", quote.Id);
                return StatusCode(500, "Internal server error when saving order.");
            }

            var orderDto = new OrderDto
            {
                OrderID = order.OrderID,
                QuoteId = order.QuoteId,
                CustomerId = order.CustomerId,
                DealerId = order.DealerId, // New field
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                PaymentMethod = order.PaymentMethod, // New field
                DeliveryDate = order.DeliveryDate, // New field
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemID = oi.OrderItemID,
                    OrderId = oi.OrderId,
                    VehicleId = oi.VehicleId,
                    VehicleModelId = oi.VehicleModelId,
                    VehicleVariantId = oi.VehicleVariantId,
                    ColorId = oi.ColorId,
                    ColorVariantId = oi.ColorVariantId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    Discount = oi.Discount,
                    PromotionApplied = oi.PromotionApplied,
                    CreatedAt = oi.CreatedAt,
                    UpdatedAt = oi.UpdatedAt
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderID }, orderDto);
        }

        [HttpGet("orders")] // New endpoint to get all orders
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems) // Include OrderItems
                .Select(o => new OrderDto
                {
                    OrderID = o.OrderID,
                    QuoteId = o.QuoteId,
                    CustomerId = o.CustomerId,
                    DealerId = o.DealerId, // New field
                    TotalPrice = o.TotalPrice,
                    Status = o.Status,
                    PaymentStatus = o.PaymentStatus,
                    PaymentMethod = o.PaymentMethod, // New field
                    DeliveryDate = o.DeliveryDate, // New field
                    Notes = o.Notes,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        OrderItemID = oi.OrderItemID,
                        OrderId = oi.OrderId,
                        VehicleId = oi.VehicleId,
                        ColorVariantId = oi.ColorVariantId,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        Discount = oi.Discount,
                        PromotionApplied = oi.PromotionApplied,
                        CreatedAt = oi.CreatedAt,
                        UpdatedAt = oi.UpdatedAt
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems) // Include OrderItems
                .FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDto = new OrderDto
            {
                OrderID = order.OrderID,
                QuoteId = order.QuoteId,
                CustomerId = order.CustomerId,
                DealerId = order.DealerId, // New field
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                PaymentMethod = order.PaymentMethod, // New field
                DeliveryDate = order.DeliveryDate, // New field
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemID = oi.OrderItemID,
                    OrderId = oi.OrderId,
                    VehicleId = oi.VehicleId,
                    ColorVariantId = oi.ColorVariantId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    Discount = oi.Discount,
                    PromotionApplied = oi.PromotionApplied,
                    CreatedAt = oi.CreatedAt,
                    UpdatedAt = oi.UpdatedAt
                }).ToList()
            };

            return Ok(orderDto);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.Status = status;
            order.UpdatedAt = GetVietnamNow(); // Use GetVietnamNow()
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for ID: {OrderId}", id);
                return StatusCode(500, "Internal server error when updating order status.");
            }
            return NoContent();
        }

        [HttpPut("orders/{id}/payment-status")]
        public async Task<IActionResult> UpdateOrderPaymentStatus(int id, [FromBody] string paymentStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.PaymentStatus = paymentStatus;
            order.UpdatedAt = GetVietnamNow(); // Use GetVietnamNow()
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order payment status for ID: {OrderId}", id);
                return StatusCode(500, "Internal server error when updating order payment status.");
            }
            return NoContent();
        }

        // --- Contract Endpoints ---
        [HttpPost("contracts")]
        public async Task<IActionResult> CreateContract([FromBody] CreateContractDto createContractDto)
        {
            var order = await _context.Orders.FindAsync(createContractDto.OrderId);
            if (order == null || order.Status != "Confirmed")
            {
                return BadRequest("Order not found or not confirmed.");
            }

            var contract = new Contract
            {
                OrderId = createContractDto.OrderId,
                ContractNumber = Guid.NewGuid().ToString(),
                ContractDetails = createContractDto.ContractDetails,
                SignDate = GetVietnamNow(), // Use GetVietnamNow()
                CreatedAt = GetVietnamNow(),
                UpdatedAt = GetVietnamNow() // Added UpdatedAt for Contract
            };

            _context.Contracts.Add(contract);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving contract to database for OrderId: {OrderId}", createContractDto.OrderId);
                return StatusCode(500, "Internal server error when saving contract.");
            }

            var contractDto = new ContractDto
            {
                Id = contract.Id,
                OrderId = contract.OrderId,
                ContractNumber = contract.ContractNumber,
                ContractDetails = contract.ContractDetails,
                SignDate = contract.SignDate,
                CreatedAt = contract.CreatedAt,
                UpdatedAt = contract.UpdatedAt
            };

            return CreatedAtAction(nameof(GetContractById), new { id = contract.Id }, contractDto);
        }

        [HttpGet("contracts/{id}")]
        public async Task<IActionResult> GetContractById(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);

            if (contract == null)
            {
                return NotFound();
            }

            var contractDto = new ContractDto
            {
                Id = contract.Id,
                OrderId = contract.OrderId,
                ContractNumber = contract.ContractNumber,
                ContractDetails = contract.ContractDetails,
                SignDate = contract.SignDate,
                CreatedAt = contract.CreatedAt,
                UpdatedAt = contract.UpdatedAt
            };

            return Ok(contractDto);
        }

        // --- Delivery Endpoints ---
        // Assuming Delivery model has CreatedAt and UpdatedAt
        [HttpPost("deliveries")]
        public async Task<IActionResult> CreateDelivery([FromBody] CreateDeliveryDto createDeliveryDto)
        {
            var order = await _context.Orders.FindAsync(createDeliveryDto.OrderId);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            var delivery = new Delivery
            {
                OrderId = createDeliveryDto.OrderId,
                TrackingNumber = createDeliveryDto.TrackingNumber,
                EstimatedDeliveryDate = createDeliveryDto.EstimatedDeliveryDate,
                ActualDeliveryDate = createDeliveryDto.ActualDeliveryDate,
                Status = createDeliveryDto.Status,
                Notes = createDeliveryDto.Notes,
                CreatedAt = GetVietnamNow(),
                UpdatedAt = GetVietnamNow()
            };

            _context.Deliveries.Add(delivery);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving delivery to database for OrderId: {OrderId}", createDeliveryDto.OrderId);
                return StatusCode(500, "Internal server error when saving delivery.");
            }

            var deliveryDto = new DeliveryDto
            {
                Id = delivery.Id,
                OrderId = delivery.OrderId,
                TrackingNumber = delivery.TrackingNumber,
                EstimatedDeliveryDate = delivery.EstimatedDeliveryDate,
                ActualDeliveryDate = delivery.ActualDeliveryDate,
                Status = delivery.Status,
                Notes = delivery.Notes,
                CreatedAt = delivery.CreatedAt,
                UpdatedAt = delivery.UpdatedAt
            };

            return CreatedAtAction(nameof(GetDeliveryById), new { id = delivery.Id }, deliveryDto);
        }

        [HttpGet("deliveries/{id}")]
        public async Task<IActionResult> GetDeliveryById(int id)
        {
            var delivery = await _context.Deliveries.FindAsync(id);

            if (delivery == null)
            {
                return NotFound();
            }

            var deliveryDto = new DeliveryDto
            {
                Id = delivery.Id,
                OrderId = delivery.OrderId,
                TrackingNumber = delivery.TrackingNumber,
                EstimatedDeliveryDate = delivery.EstimatedDeliveryDate,
                ActualDeliveryDate = delivery.ActualDeliveryDate,
                Status = delivery.Status,
                Notes = delivery.Notes,
                CreatedAt = delivery.CreatedAt,
                UpdatedAt = delivery.UpdatedAt
            };

            return Ok(deliveryDto);
        }

        // --- Payment Endpoints ---
        [HttpPost("payments")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDto createPaymentDto)
        {
            var order = await _context.Orders.FindAsync(createPaymentDto.OrderId);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            var payment = new Payment
            {
                OrderId = createPaymentDto.OrderId,
                Amount = createPaymentDto.Amount,
                PaymentDate = createPaymentDto.PaymentDate,
                PaymentMethod = createPaymentDto.PaymentMethod,
                Status = createPaymentDto.Status,
                TransactionId = createPaymentDto.TransactionId,
                Notes = createPaymentDto.Notes,
                CreatedAt = GetVietnamNow(),
                UpdatedAt = GetVietnamNow()
            };

            _context.Payments.Add(payment);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving payment to database for OrderId: {OrderId}", createPaymentDto.OrderId);
                return StatusCode(500, "Internal server error when saving payment.");
            }

            var paymentDto = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                PaymentDate = payment.PaymentDate,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status,
                TransactionId = payment.TransactionId,
                Notes = payment.Notes,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt
            };

            return CreatedAtAction(nameof(GetPaymentById), new { id = payment.Id }, paymentDto);
        }

        [HttpGet("payments/{id}")]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            var paymentDto = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                PaymentDate = payment.PaymentDate,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status,
                TransactionId = payment.TransactionId,
                Notes = payment.Notes,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt
            };

            return Ok(paymentDto);
        }

        // --- Manufacturer Order Endpoint ---
        [HttpPost("manufacturer-orders")]
        public IActionResult CreateManufacturerOrder([FromBody] CreateManufacturerOrderDto createManufacturerOrderDto)
        {
            var manufacturerOrderEvent = new
            {
                ManufacturerOrderId = Guid.NewGuid(),
                createManufacturerOrderDto.DealerId,
                createManufacturerOrderDto.VehicleId,
                createManufacturerOrderDto.Quantity,
                createManufacturerOrderDto.Notes,
                Timestamp = GetVietnamNow()
            };

            // const string routingKey = "manufacturer.order.created";
            // try
            // {
            //     _messageProducer.PublishMessage(manufacturerOrderEvent, routingKey);
            //     _logger.LogInformation("Manufacturer order request sent for DealerId: {DealerId}, VehicleId: {VehicleId}", manufacturerOrderEvent.DealerId, manufacturerOrderEvent.VehicleId);
            // }
            // catch (Exception ex)
            // {
            //     _logger.LogError(ex, "Error sending manufacturer order message to RabbitMQ.");
            //     return StatusCode(500, "Internal server error when sending manufacturer order.");
            // }

            _logger.LogInformation("Manufacturer order request received but message queueing is disabled. Details: DealerId: {DealerId}, VehicleId: {VehicleId}", manufacturerOrderEvent.DealerId, manufacturerOrderEvent.VehicleId);


            return Ok(new
            {
                Message = "Manufacturer order request received. Message queueing is disabled.",
                ManufacturerOrderId = manufacturerOrderEvent.ManufacturerOrderId,
                manufacturerOrderEvent.DealerId,
                manufacturerOrderEvent.VehicleId
            });
        }

        // --- PDF Generation Endpoint ---
        [HttpPost("generate-quote-pdf")]
        public IActionResult GenerateQuotePdf([FromBody] GenerateQuotePdfRequestDto request)
        {
            try
            {
                var document = new QuotePdfDocument(request);
                byte[] pdfBytes = document.GeneratePdf();
                var vnNow = GetVietnamNow();
                return File(pdfBytes, "application/pdf", $"BaoGiaXeDien_{vnNow:yyyyMMddHHmmss}.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating quote PDF.");
                return StatusCode(500, "Internal server error when generating PDF.");
            }
        }
    }
}
