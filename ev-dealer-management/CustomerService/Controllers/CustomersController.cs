using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerService.Data;
using CustomerService.Models;
using CustomerService.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CustomerDbContext _context;
        private readonly IMessageProducer _messageProducer;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(CustomerDbContext context, IMessageProducer messageProducer, ILogger<CustomersController> logger)
        {
            _context = context;
            _messageProducer = messageProducer;
            _logger = logger;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            _logger.LogInformation("Fetching all customers.");
            return await _context.Customers.ToListAsync();
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            _logger.LogInformation("Fetching customer with ID: {CustomerId}", id);
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                _logger.LogWarning("Customer with ID: {CustomerId} not found.", id);
                return NotFound();
            }

            return customer;
        }

        // POST: api/Customers
        [Authorize(Roles = "DealerStaff,DealerManager")]
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            _logger.LogInformation("Creating new customer: {CustomerName}", customer.Name);
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            _messageProducer.PublishMessage(customer, "customer.created");
            _logger.LogInformation("Customer created and message published for customer ID: {CustomerId}", customer.Id);

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (id != customer.Id)
            {
                _logger.LogWarning("Mismatched customer ID in PUT request. Route ID: {RouteId}, Customer ID: {CustomerId}", id, customer.Id);
                return BadRequest();
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _messageProducer.PublishMessage(customer, "customer.updated");
                _logger.LogInformation("Customer with ID: {CustomerId} updated and message published.", customer.Id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    _logger.LogWarning("Customer with ID: {CustomerId} not found during update.", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            _logger.LogInformation("Deleting customer with ID: {CustomerId}", id);
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                _logger.LogWarning("Customer with ID: {CustomerId} not found for deletion.", id);
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            _messageProducer.PublishMessage(new { CustomerId = id, EventType = "Deleted" }, "customer.deleted");
            _logger.LogInformation("Customer with ID: {CustomerId} deleted and message published.", id);

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}
