using Microsoft.AspNetCore.Mvc;
// Removed: using SalesService.Services; // No longer needed as IMessageProducer is removed
using SalesService.DTOs; // Assuming CreateOrderRequest and SaleCompletedEvent are defined here or in a shared DTOs file
using Microsoft.Extensions.Logging; // Keep this for logging

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        // Removed: private readonly IMessageProducer _messageProducer;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(/* Removed: IMessageProducer messageProducer, */ ILogger<OrdersController> logger)
        {
            // Removed: _messageProducer = messageProducer;
            _logger = logger;
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

                // Removed: Create event and publish to RabbitMQ
                // var saleCompletedEvent = new SaleCompletedEvent
                // {
                //     OrderId = orderId,
                //     CustomerName = request.CustomerName,
                //     CustomerEmail = request.CustomerEmail,
                //     VehicleModel = request.VehicleModel,
                //     TotalAmount = request.TotalAmount,
                //     OrderDate = DateTime.UtcNow,
                //     PaymentMethod = request.PaymentMethod,
                //     Quantity = request.Quantity
                // };
                // _messageProducer.PublishMessage(saleCompletedEvent, "sales.completed");

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
        /// Health check endpoint
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy", service = "SalesService", timestamp = DateTime.UtcNow });
        }
    }
}
