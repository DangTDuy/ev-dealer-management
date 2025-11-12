using Microsoft.AspNetCore.Mvc;
using CustomerService.Services;
using CustomerService.DTOs; // Assuming DTOs folder exists or will be created

namespace CustomerService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly IMessageProducer _messageProducer;
        private readonly ILogger<CustomerController> _logger;
        private readonly ICustomerService _customerService;

        public CustomerController(IMessageProducer messageProducer, ILogger<CustomerController> logger, ICustomerService customerService)
        {
            _messageProducer = messageProducer;
            _logger = logger;
            _customerService = customerService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest customerDto)
        {
            _logger.LogInformation("Received request to create customer: {CustomerName}", customerDto.Name);

            try
            {
                var createdCustomer = await _customerService.CreateCustomerAsync(customerDto);

                var customerCreatedEvent = new CustomerCreatedEvent
                {
                    CustomerId = Guid.Parse(createdCustomer.Id.ToString()), // Convert int ID to Guid for the event
                    Name = createdCustomer.Name,
                    Email = createdCustomer.Email,
                    Timestamp = DateTime.UtcNow
                };

                _messageProducer.PublishMessage(customerCreatedEvent, "customer.created");
                _logger.LogInformation("CustomerCreatedEvent published for customer: {CustomerName}", createdCustomer.Name);
                return Ok(new { Message = "Customer created and event published.", CustomerId = createdCustomer.Id });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Customer creation failed due to: {Message}", ex.Message);
                return Conflict(ex.Message); // 409 Conflict for existing email
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer or publishing CustomerCreatedEvent for customer: {CustomerName}", customerDto.Name);
                return StatusCode(500, "Internal server error while creating customer or publishing event.");
            }
        }
    }
}