
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerService.Data;
using CustomerService.Models;

using Microsoft.AspNetCore.Authorization;

using System.Security.Claims;

namespace CustomerService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TestDrivesController : ControllerBase
    {
        private readonly CustomerDbContext _context;
        private readonly ILogger<TestDrivesController> _logger;

        public TestDrivesController(CustomerDbContext context, ILogger<TestDrivesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/TestDrives
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestDrive>>> GetTestDrives()
        {
            var user = HttpContext.User;

            if (user.IsInRole(UserRoles.Admin) || user.IsInRole(UserRoles.EVMStaff))
            {
                _logger.LogInformation("Admin/EVM Staff fetching all test drives.");
                return await _context.TestDrives
                    .Include(td => td.Customer)
                    .ToListAsync();
            }

            if (user.IsInRole(UserRoles.DealerManager) || user.IsInRole(UserRoles.DealerStaff))
            {
                var dealerIdClaim = user.FindFirst("dealerId");
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim.Value, out var dealerId))
                {
                    _logger.LogWarning("Dealer user {UserName} is missing or has an invalid dealerId claim.", user.Identity?.Name);
                    return BadRequest("Dealer information is missing from your account.");
                }

                _logger.LogInformation("Dealer {DealerId} fetching their test drives.", dealerId);
                return await _context.TestDrives
                    .Include(td => td.Customer)
                    .Where(td => td.DealerId == dealerId)
                    .ToListAsync();
            }

            return Forbid();
        }

        // GET: api/TestDrives/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TestDrive>> GetTestDrive(int id)
        {
            var testDrive = await _context.TestDrives
                .Include(td => td.Customer)
                .FirstOrDefaultAsync(td => td.Id == id);

            if (testDrive == null)
            {
                return NotFound();
            }

            var user = HttpContext.User;
            if (user.IsInRole(UserRoles.Admin) || user.IsInRole(UserRoles.EVMStaff))
            {
                return testDrive;
            }

            if (user.IsInRole(UserRoles.DealerManager) || user.IsInRole(UserRoles.DealerStaff))
            {
                var dealerIdClaim = user.FindFirst("dealerId");
                if (dealerIdClaim != null && int.TryParse(dealerIdClaim.Value, out var dealerId) && testDrive.DealerId == dealerId)
                {
                    return testDrive;
                }
            }

            _logger.LogWarning("User {UserName} forbidden to access test drive {TestDriveId}.", user.Identity?.Name, id);
            return Forbid();
        }

        // GET: api/TestDrives/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<TestDrive>>> GetTestDrivesByCustomer(int customerId)
        {
            var user = HttpContext.User;
            IQueryable<TestDrive> query = _context.TestDrives.Include(td => td.Customer);

            if (user.IsInRole(UserRoles.Admin) || user.IsInRole(UserRoles.EVMStaff))
            {
                query = query.Where(td => td.CustomerId == customerId);
            }
            else if (user.IsInRole(UserRoles.DealerManager) || user.IsInRole(UserRoles.DealerStaff))
            {
                var dealerIdClaim = user.FindFirst("dealerId");
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim.Value, out var dealerId))
                {
                    _logger.LogWarning("Dealer user {UserName} is missing or has an invalid dealerId claim.", user.Identity?.Name);
                    return BadRequest("Dealer information is missing from your account.");
                }
                query = query.Where(td => td.CustomerId == customerId && td.DealerId == dealerId);
            }
            else
            {
                return Forbid();
            }

            var testDrives = await query.ToListAsync();

            if (!testDrives.Any())
            {
                return NotFound();
            }

            return testDrives;
        }

        // POST: api/TestDrives
        [HttpPost]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.DealerManager},{UserRoles.DealerStaff}")]
        public async Task<ActionResult<TestDrive>> PostTestDrive(TestDrive testDrive)
        {
            var user = HttpContext.User;

            // Validate that customer exists
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == testDrive.CustomerId);
            if (!customerExists)
            {
                return BadRequest("Customer not found.");
            }

            if (user.IsInRole(UserRoles.DealerManager) || user.IsInRole(UserRoles.DealerStaff))
            {
                var dealerIdClaim = user.FindFirst("dealerId");
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim.Value, out var dealerId))
                {
                    return BadRequest("Dealer information is missing from your account.");
                }
                testDrive.DealerId = dealerId; // Force assign dealerId
            }
            else if (!user.IsInRole(UserRoles.Admin))
            {
                return Forbid(); // Should not happen due to [Authorize] attribute, but as a safeguard
            }
            // Admin must provide DealerId in the request body.

            testDrive.CreatedAt = DateTime.UtcNow;
            _context.TestDrives.Add(testDrive);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created test drive {TestDriveId} for customer {CustomerId}.", testDrive.Id, testDrive.CustomerId);
            return CreatedAtAction(nameof(GetTestDrive), new { id = testDrive.Id }, testDrive);
        }

        // PUT: api/TestDrives/5/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.DealerManager},{UserRoles.DealerStaff}")]
        public async Task<IActionResult> PutTestDriveStatus(int id, [FromBody] string status)
        {
            var testDrive = await _context.TestDrives.FindAsync(id);
            if (testDrive == null)
            {
                return NotFound();
            }

            var user = HttpContext.User;
            if (user.IsInRole(UserRoles.DealerManager) || user.IsInRole(UserRoles.DealerStaff))
            {
                var dealerIdClaim = user.FindFirst("dealerId");
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim.Value, out var dealerId) || testDrive.DealerId != dealerId)
                {
                    _logger.LogWarning("Dealer user {UserName} forbidden to update test drive {TestDriveId} from another dealer.", user.Identity?.Name, id);
                    return Forbid();
                }
            }

            // Validate status
            var validStatuses = new[] { "Scheduled", "Completed", "Canceled" };
            if (!validStatuses.Contains(status))
            {
                return BadRequest("Invalid status. Valid statuses are: Scheduled, Completed, Canceled");
            }

            testDrive.Status = status;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated test drive {TestDriveId} status to {Status}.", id, status);
            return NoContent();
        }

        // PUT: api/TestDrives/5
        [HttpPut("{id}")]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.DealerManager},{UserRoles.DealerStaff}")]
        public async Task<IActionResult> PutTestDrive(int id, TestDrive testDrive)
        {
            if (id != testDrive.Id)
            {
                return BadRequest();
            }

            var existingTestDrive = await _context.TestDrives.AsNoTracking().FirstOrDefaultAsync(td => td.Id == id);
            if (existingTestDrive == null)
            {
                return NotFound();
            }

            var user = HttpContext.User;
            if (user.IsInRole(UserRoles.DealerManager) || user.IsInRole(UserRoles.DealerStaff))
            {
                var dealerIdClaim = user.FindFirst("dealerId");
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim.Value, out var dealerId) || existingTestDrive.DealerId != dealerId)
                {
                    _logger.LogWarning("Dealer user {UserName} forbidden to update test drive {TestDriveId} from another dealer.", user.Identity?.Name, id);
                    return Forbid();
                }
                testDrive.DealerId = dealerId; // Ensure dealer cannot change the dealerId
            }

            _context.Entry(testDrive).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Updated test drive {TestDriveId}.", id);
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
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.DealerManager}")]
        public async Task<IActionResult> DeleteTestDrive(int id)
        {
            var testDrive = await _context.TestDrives.FindAsync(id);
            if (testDrive == null)
            {
                return NotFound();
            }

            var user = HttpContext.User;
            if (user.IsInRole(UserRoles.DealerManager))
            {
                var dealerIdClaim = user.FindFirst("dealerId");
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim.Value, out var dealerId) || testDrive.DealerId != dealerId)
                {
                    _logger.LogWarning("DealerManager user {UserName} forbidden to delete test drive {TestDriveId} from another dealer.", user.Identity?.Name, id);
                    return Forbid();
                }
            }

            _context.TestDrives.Remove(testDrive);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted test drive {TestDriveId}.", id);
            return NoContent();
        }

        private bool TestDriveExists(int id)
        {
            return _context.TestDrives.Any(e => e.Id == id);
        }
    }
}
