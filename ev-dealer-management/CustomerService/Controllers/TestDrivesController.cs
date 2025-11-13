using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerService.Data;
using CustomerService.Models;
using CustomerService.DTOs;

namespace CustomerService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDrivesController : ControllerBase
    {
        private readonly CustomerDbContext _context;

        public TestDrivesController(CustomerDbContext context)
        {
            _context = context;
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
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == createTestDriveRequest.CustomerId);
            if (!customerExists)
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
                CustomerName = (await _context.Customers.FindAsync(testDrive.CustomerId))?.Name
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