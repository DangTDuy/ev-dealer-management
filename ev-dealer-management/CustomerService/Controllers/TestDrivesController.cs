using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerService.Data;
using CustomerService.Models;
using CustomerService.DTOs;
using CustomerService.Services;

namespace CustomerService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDrivesController : ControllerBase
    {
        private readonly CustomerDbContext _context;
        private readonly IMessageProducer _messageProducer;
        private readonly ILogger<TestDrivesController> _logger;

        public TestDrivesController(
            CustomerDbContext context,
            IMessageProducer messageProducer,
            ILogger<TestDrivesController> logger)
        {
            _context = context;
            _messageProducer = messageProducer;
            _logger = logger;
        }

        // GET: api/TestDrives
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestDriveDto>>> GetTestDrives()
        {
            return await _context.TestDrives
                .Include(td => td.Customer)
                .Select(td => new TestDriveDto
                {
                    Id = td.Id,
                    CustomerId = td.CustomerId,
                    VehicleId = td.VehicleId,
                    DealerId = td.DealerId,
                    AppointmentDate = td.AppointmentDate,
                    Status = td.Status,
                    Notes = td.Notes,
                    CreatedAt = td.CreatedAt,
                    CustomerName = td.Customer != null ? td.Customer.Name : null
                })
                .ToListAsync();
        }

        // GET: api/TestDrives/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TestDriveDto>> GetTestDrive(int id)
        {
            var testDrive = await _context.TestDrives
                .Include(td => td.Customer)
                .Where(td => td.Id == id)
                .Select(td => new TestDriveDto
                {
                    Id = td.Id,
                    CustomerId = td.CustomerId,
                    VehicleId = td.VehicleId,
                    DealerId = td.DealerId,
                    AppointmentDate = td.AppointmentDate,
                    Status = td.Status,
                    Notes = td.Notes,
                    CreatedAt = td.CreatedAt,
                    CustomerName = td.Customer != null ? td.Customer.Name : null
                })
                .FirstOrDefaultAsync();

            if (testDrive == null)
            {
                return NotFound();
            }

            return testDrive;
        }

        // POST: api/TestDrives
        [HttpPost]
        public async Task<ActionResult<TestDriveDto>> PostTestDrive(CreateTestDriveRequest createTestDriveRequest)
        {
            var customer = await _context.Customers.FindAsync(createTestDriveRequest.CustomerId);
            if (customer == null)
            {
                return BadRequest("Customer not found.");
            }

            var testDrive = new TestDrive
            {
                CustomerId = createTestDriveRequest.CustomerId,
                VehicleId = createTestDriveRequest.VehicleId,
                DealerId = createTestDriveRequest.DealerId,
                AppointmentDate = createTestDriveRequest.AppointmentDate,
                Notes = createTestDriveRequest.Notes,
                Status = "Scheduled", // Default status
                CreatedAt = DateTime.UtcNow
            };

            _context.TestDrives.Add(testDrive);
            await _context.SaveChangesAsync();

            // Publish event to RabbitMQ for notification
            try
            {
                var testDriveEvent = new TestDriveScheduledEvent
                {
                    CustomerEmail = customer.Email,
                    CustomerName = customer.Name,
                    VehicleModel = $"Vehicle #{createTestDriveRequest.VehicleId}", // TODO: Fetch from VehicleService
                    ScheduledDate = createTestDriveRequest.AppointmentDate
                };

                _messageProducer.PublishMessage(testDriveEvent, "testdrive.scheduled");
                _logger.LogInformation($"Published TestDriveScheduledEvent for customer {customer.Email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish TestDriveScheduledEvent");
                // Don't fail the request if notification fails
            }

            var testDriveDto = new TestDriveDto
            {
                Id = testDrive.Id,
                CustomerId = testDrive.CustomerId,
                VehicleId = testDrive.VehicleId,
                DealerId = testDrive.DealerId,
                AppointmentDate = testDrive.AppointmentDate,
                Status = testDrive.Status,
                Notes = testDrive.Notes,
                CreatedAt = testDrive.CreatedAt,
                CustomerName = customer.Name
            };

            return CreatedAtAction(nameof(GetTestDrive), new { id = testDrive.Id }, testDriveDto);
        }

        // PUT: api/TestDrives/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTestDrive(int id, UpdateTestDriveRequest updateTestDriveRequest)
        {
            var testDrive = await _context.TestDrives.FindAsync(id);
            if (testDrive == null)
            {
                return NotFound();
            }

            testDrive.AppointmentDate = updateTestDriveRequest.AppointmentDate ?? testDrive.AppointmentDate;
            testDrive.Status = updateTestDriveRequest.Status ?? testDrive.Status;
            testDrive.Notes = updateTestDriveRequest.Notes ?? testDrive.Notes;
            testDrive.CreatedAt = DateTime.UtcNow; // Update CreatedAt to UpdatedAt

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TestDriveExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/TestDrives/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTestDrive(int id)
        {
            var testDrive = await _context.TestDrives.FindAsync(id);
            if (testDrive == null)
            {
                return NotFound();
            }

            _context.TestDrives.Remove(testDrive);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TestDriveExists(int id)
        {
            return _context.TestDrives.Any(e => e.Id == id);
        }
    }
}