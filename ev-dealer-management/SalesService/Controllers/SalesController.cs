using Microsoft.AspNetCore.Mvc;
using SalesService.DTOs;
using SalesService.Models;
using SalesService.Data;
using SalesService.Messaging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly SalesDbContext _context;
        private readonly IMessageProducer _messageProducer;
        private readonly ILogger<SalesController> _logger;

        public SalesController(SalesDbContext context, IMessageProducer messageProducer, ILogger<SalesController> logger)
        {
            _context = context;
            _messageProducer = messageProducer;
            _logger = logger;
        }

        // --- Quote Endpoints ---
        [HttpPost("quotes")]
        public async Task<IActionResult> CreateQuote([FromBody] CreateQuoteDto createQuoteDto)
        {
            decimal unitPrice = 25000.00m; // Dummy price
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
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
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
                CreatedAt = quote.CreatedAt,
                UpdatedAt = quote.UpdatedAt,
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
            var quotes = await _context.Quotes
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
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt,
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
                CreatedAt = quote.CreatedAt,
                UpdatedAt = quote.UpdatedAt,
                // New payment fields
                PaymentType = quote.PaymentType,
                DownPaymentPercent = quote.DownPaymentPercent,
                LoanTerm = quote.LoanTerm,
                InterestRate = quote.InterestRate
            };

            return Ok(quoteDto);
        }

        [HttpPut("quotes/{id}/status")]
        public async Task<IActionResult> UpdateQuoteStatus(int id, [FromBody] string status)
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null)
            {
                return NotFound();
            }

            quote.Status = status;
            quote.UpdatedAt = DateTime.UtcNow;
            try
            {
                await _context.SaveChangesAsync();
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
            if (quote == null || quote.Status != "Accepted")
            {
                return BadRequest("Quote not found or not accepted.");
            }

            var order = new Order
            {
                QuoteId = quote.Id,
                CustomerId = quote.CustomerId,
                VehicleId = quote.VehicleId,
                Quantity = quote.Quantity,
                TotalPrice = quote.TotalPrice,
                PaymentMethod = createOrderDto.PaymentMethod,
                Notes = createOrderDto.Notes,
                Status = "Pending",
                PaymentStatus = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving order to database for QuoteId: {QuoteId}", quote.Id);
                return StatusCode(500, "Internal server error when saving order.");
            }

            var orderDto = new OrderDto
            {
                Id = order.Id,
                QuoteId = order.QuoteId,
                CustomerId = order.CustomerId,
                VehicleId = order.VehicleId,
                Quantity = order.Quantity,
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                PaymentMethod = order.PaymentMethod,
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt
            };

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, orderDto);
        }

        [HttpGet("orders")] // New endpoint to get all orders
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    QuoteId = o.QuoteId,
                    CustomerId = o.CustomerId,
                    VehicleId = o.VehicleId,
                    Quantity = o.Quantity,
                    TotalPrice = o.TotalPrice,
                    Status = o.Status,
                    PaymentStatus = o.PaymentStatus,
                    PaymentMethod = o.PaymentMethod,
                    Notes = o.Notes,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDto = new OrderDto
            {
                Id = order.Id,
                QuoteId = order.QuoteId,
                CustomerId = order.CustomerId,
                VehicleId = order.VehicleId,
                Quantity = order.Quantity,
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                PaymentMethod = order.PaymentMethod,
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt
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
            order.UpdatedAt = DateTime.UtcNow;
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
            order.UpdatedAt = DateTime.UtcNow;
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
                SignDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
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
                CreatedAt = contract.CreatedAt
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
                CreatedAt = contract.CreatedAt
            };

            return Ok(contractDto);
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
                Timestamp = DateTime.UtcNow
            };

            const string routingKey = "manufacturer.order.created";
            try
            {
                _messageProducer.SendMessage(manufacturerOrderEvent, routingKey);
                _logger.LogInformation("Manufacturer order request sent for DealerId: {DealerId}, VehicleId: {VehicleId}", manufacturerOrderEvent.DealerId, manufacturerOrderEvent.VehicleId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending manufacturer order message to RabbitMQ.");
                return StatusCode(500, "Internal server error when sending manufacturer order.");
            }

            return Ok(new
            {
                Message = "Manufacturer order request sent.",
                ManufacturerOrderId = manufacturerOrderEvent.ManufacturerOrderId,
                manufacturerOrderEvent.DealerId,
                manufacturerOrderEvent.VehicleId
            });
        }
    }
}
