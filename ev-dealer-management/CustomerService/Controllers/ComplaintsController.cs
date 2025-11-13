using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerService.Data;
using CustomerService.Models;
using CustomerService.DTOs;

namespace CustomerService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplaintsController : ControllerBase
    {
        private readonly CustomerDbContext _context;

        public ComplaintsController(CustomerDbContext context)
        {
            _context = context;
        }

        // GET: api/Complaints
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComplaintDto>>> GetComplaints()
        {
            return await _context.Complaints
                .Include(c => c.Customer)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id,
                    CustomerId = c.CustomerId,
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    ResolvedAt = c.ResolvedAt,
                    Resolution = c.Resolution,
                    CustomerName = c.Customer != null ? c.Customer.Name : null
                })
                .ToListAsync();
        }

        // GET: api/Complaints/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ComplaintDto>> GetComplaint(int id)
        {
            var complaint = await _context.Complaints
                .Include(c => c.Customer)
                .Where(c => c.Id == id)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id,
                    CustomerId = c.CustomerId,
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    ResolvedAt = c.ResolvedAt,
                    Resolution = c.Resolution,
                    CustomerName = c.Customer != null ? c.Customer.Name : null
                })
                .FirstOrDefaultAsync();

            if (complaint == null)
            {
                return NotFound();
            }

            return complaint;
        }

        // POST: api/Complaints
        [HttpPost]
        public async Task<ActionResult<ComplaintDto>> PostComplaint(CreateComplaintRequest createComplaintRequest)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == createComplaintRequest.CustomerId);
            if (!customerExists)
            {
                return BadRequest("Customer not found.");
            }

            var complaint = new Complaint
            {
                CustomerId = createComplaintRequest.CustomerId,
                Title = createComplaintRequest.Title,
                Description = createComplaintRequest.Description,
                Status = "Open", // Default status
                CreatedAt = DateTime.UtcNow
            };

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            var complaintDto = new ComplaintDto
            {
                Id = complaint.Id,
                CustomerId = complaint.CustomerId,
                Title = complaint.Title,
                Description = complaint.Description,
                Status = complaint.Status,
                CreatedAt = complaint.CreatedAt,
                ResolvedAt = complaint.ResolvedAt,
                Resolution = complaint.Resolution,
                CustomerName = (await _context.Customers.FindAsync(complaint.CustomerId))?.Name
            };

            return CreatedAtAction(nameof(GetComplaint), new { id = complaint.Id }, complaintDto);
        }

        // PUT: api/Complaints/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComplaint(int id, UpdateComplaintRequest updateComplaintRequest)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null)
            {
                return NotFound();
            }

            complaint.Title = updateComplaintRequest.Title ?? complaint.Title;
            complaint.Description = updateComplaintRequest.Description ?? complaint.Description;
            complaint.Status = updateComplaintRequest.Status ?? complaint.Status;
            complaint.Resolution = updateComplaintRequest.Resolution ?? complaint.Resolution;

            if (updateComplaintRequest.Status == "Resolved" && complaint.ResolvedAt == null)
            {
                complaint.ResolvedAt = DateTime.UtcNow;
            }
            else if (updateComplaintRequest.Status != "Resolved" && complaint.ResolvedAt != null)
            {
                complaint.ResolvedAt = null;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ComplaintExists(id))
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

        // DELETE: api/Complaints/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComplaint(int id)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null)
            {
                return NotFound();
            }

            _context.Complaints.Remove(complaint);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ComplaintExists(int id)
        {
            return _context.Complaints.Any(e => e.Id == id);
        }
    }
}
