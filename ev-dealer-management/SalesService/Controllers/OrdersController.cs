using Microsoft.AspNetCore.Mvc;
using SalesService.DTOs;
using Microsoft.Extensions.Logging;
using SalesService.Data;
using Microsoft.EntityFrameworkCore;
using SalesService.Models;
using System.Collections.Generic;
using System; // Required for DateTime

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;
        private readonly SalesDbContext _context;

        public OrdersController(ILogger<OrdersController> logger, SalesDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// Create a new order and send order confirmation email
        /// </summary>
        [HttpPost("complete")]
        public async Task<IActionResult> CompleteOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                _logger.LogInformation("Received CreateOrderRequest: {@Request}", request); // Log the entire request object

                // Basic validation from DTO
                if (string.IsNullOrWhiteSpace(request.CustomerEmail))
                {
                    _logger.LogWarning("Customer email is missing in CreateOrderRequest.");
                    return BadRequest(new { message = "Customer email is required" });
                }

                if (string.IsNullOrWhiteSpace(request.CustomerName))
                {
                    _logger.LogWarning("Customer name is missing in CreateOrderRequest.");
                    return BadRequest(new { message = "Customer name is required" });
                }
                
                // Create new Order object
                var order = new Order
                {
                    QuoteId = request.QuoteId,
                    CustomerId = request.CustomerId,
                    DealerId = request.DealerId,
                    SalespersonId = request.SalespersonId,
                    VehicleId = request.VehicleId,
                    VariantId = request.VehicleVariantId, // Map from VehicleVariantId in DTO
                    ColorId = request.ColorId,
                    Quantity = request.Quantity,
                    UnitPrice = request.UnitPrice,
                    
                    // Payment & Delivery
                    PaymentMethod = request.PaymentType, // "Full" or "Installment"
                    PaymentForm = request.PaymentMethod, // "Cash" or "Bank transfer"
                    DeliveryPreferredDate = request.DeliveryDate,
                    DeliveryExpectedDate = request.EstimatedDeliveryDate,
                    Notes = request.Notes,

                    // Installment Info (Nullable)
                    DepositAmount = request.DepositAmount,
                    LoanTermMonths = request.LoanTermMonths,
                    InterestRateYearly = request.InterestRateYearly,

                    // Promotion fields
                    DiscountPercent = request.DiscountPercent,
                    DiscountAmount = request.DiscountAmount,
                };

                _logger.LogInformation("Order object initialized from request (before price calculation): UnitPrice={UnitPrice}, Quantity={Quantity}, DiscountAmount={DiscountAmount}, DiscountPercent={DiscountPercent}",
                    order.UnitPrice, order.Quantity, order.DiscountAmount, order.DiscountPercent);

                // --- Calculate SubTotal, TotalDiscount, TotalPrice on Backend ---
                order.SubTotal = order.UnitPrice * order.Quantity;

                decimal totalDiscountCalculated = 0;
                if (order.DiscountAmount.HasValue)
                {
                    totalDiscountCalculated = order.DiscountAmount.Value;
                }
                else if (order.DiscountPercent.HasValue)
                {
                    totalDiscountCalculated = order.SubTotal * (order.DiscountPercent.Value / 100);
                }
                order.TotalDiscount = totalDiscountCalculated;

                order.TotalPrice = order.SubTotal - order.TotalDiscount;

                // Ensure TotalPrice is not negative
                if (order.TotalPrice < 0)
                {
                    order.TotalPrice = 0;
                }

                _logger.LogInformation("Order price calculation results: SubTotal={SubTotal}, TotalDiscount={TotalDiscount}, TotalPrice={TotalPrice}",
                    order.SubTotal, order.TotalDiscount, order.TotalPrice);

                // --- Backend Validation for TotalPrice ---
                if (order.TotalPrice <= 0)
                {
                    _logger.LogWarning("Order TotalPrice is <= 0 ({TotalPrice}). Returning BadRequest.", order.TotalPrice);
                    return BadRequest(new { message = "Total price calculated on backend must be greater than 0. Please check quote details or promotion." });
                }

                // Generate OrderNumber and set Status
                order.OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";
                order.Status = "Pending"; // Default status for a new order

                // Add to database
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Order {OrderNumber} completed for customer {CustomerEmail}. Order ID: {OrderId}.", order.OrderNumber, request.CustomerEmail, order.OrderId);

                return Ok(new
                {
                    success = true,
                    message = "Order completed successfully.",
                    orderId = order.OrderId,
                    orderNumber = order.OrderNumber,
                    customerEmail = request.CustomerEmail,
                    totalPrice = order.TotalPrice
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing order");
                return StatusCode(500, new { message = "Failed to complete order", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all orders.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            try
            {
                var orders = await _context.Orders.ToListAsync();
                _logger.LogInformation("Retrieved {Count} orders.", orders.Count);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all orders from database.");
                return StatusCode(500, new { message = "Failed to retrieve orders from database", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific order by its ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);

                if (order == null)
                {
                    _logger.LogWarning("Order with ID {OrderId} not found.", id);
                    return NotFound();
                }

                _logger.LogInformation("Retrieved order with ID {OrderId}.", id);
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order with ID {OrderId}.", id);
                return StatusCode(500, new { message = "Failed to retrieve order", error = ex.Message });
            }
        }

        /// <summary>
        /// Health check endpoint
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy", service = "SalesService", timestamp = DateTime.UtcNow });
        }
    }
}
