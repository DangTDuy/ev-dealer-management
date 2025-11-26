using Microsoft.AspNetCore.Mvc;
using SalesService.DTOs;
using Microsoft.Extensions.Logging;
using SalesService.Data; // Import SalesDbContext
using Microsoft.EntityFrameworkCore; // Import for ToListAsync()
using SalesService.Models; // Import Order model
using System.Collections.Generic; // Required for List<Order>

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;
        private readonly SalesDbContext _context; // Inject SalesDbContext

        public OrdersController(ILogger<OrdersController> logger, SalesDbContext context)
        {
            _logger = logger;
            _context = context; // Initialize SalesDbContext
        }

        /// <summary>
        /// Create a new order and send order confirmation email
        /// </summary>
        [HttpPost("complete")]
        public IActionResult CompleteOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrWhiteSpace(request.CustomerEmail))
                {
                    return BadRequest(new { message = "Customer email is required" });
                }

                if (string.IsNullOrWhiteSpace(request.CustomerName))
                {
                    return BadRequest(new { message = "Customer name is required" });
                }

                if (request.TotalAmount <= 0)
                {
                    return BadRequest(new { message = "Total amount must be greater than 0" });
                }

                // Generate order ID
                var orderId = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

                _logger.LogInformation("Order {OrderId} completed for customer {CustomerEmail}. Message queueing is disabled.", orderId, request.CustomerEmail);

                return Ok(new
                {
                    success = true,
                    message = "Order completed successfully. Message queueing is disabled.",
                    orderId = orderId,
                    customerEmail = request.CustomerEmail
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
                var orders = await _context.Orders.ToListAsync(); // Reverted to query database
                _logger.LogInformation("Retrieved {Count} orders.", orders.Count);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all orders from database."); // Updated log message
                return StatusCode(500, new { message = "Failed to retrieve orders from database", error = ex.Message });
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
