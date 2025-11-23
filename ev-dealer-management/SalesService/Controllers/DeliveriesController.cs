using Microsoft.AspNetCore.Mvc;
using SalesService.DTOs;
using SalesService.Models;
using SalesService.Data;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveriesController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public DeliveriesController(SalesDbContext context)
        {
            _context = context;
        }

        // GET: api/Deliveries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryDto>>> GetDeliveries()
        {
            var deliveries = await _context.Deliveries
                .Select(d => new DeliveryDto
                {
                    Id = d.Id,
                    OrderId = d.OrderId,
                    TrackingNumber = d.TrackingNumber,
                    EstimatedDeliveryDate = d.EstimatedDeliveryDate,
                    ActualDeliveryDate = d.ActualDeliveryDate,
                    Status = d.Status,
                    Notes = d.Notes,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                })
                .ToListAsync();

            return Ok(deliveries);
        }

        // GET: api/Deliveries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryDto>> GetDelivery(int id)
        {
            var delivery = await _context.Deliveries.FindAsync(id);

            if (delivery == null)
            {
                return NotFound();
            }

            var deliveryDto = new DeliveryDto
            {
                Id = delivery.Id,
                OrderId = delivery.OrderId,
                TrackingNumber = delivery.TrackingNumber,
                EstimatedDeliveryDate = delivery.EstimatedDeliveryDate,
                ActualDeliveryDate = delivery.ActualDeliveryDate,
                Status = delivery.Status,
                Notes = delivery.Notes,
                CreatedAt = delivery.CreatedAt,
                UpdatedAt = delivery.UpdatedAt
            };

            return Ok(deliveryDto);
        }

        // POST: api/Deliveries
        [HttpPost]
        public async Task<ActionResult<DeliveryDto>> CreateDelivery([FromBody] CreateDeliveryDto createDeliveryDto)
        {
            var order = await _context.Orders.FindAsync(createDeliveryDto.OrderId);
            if (order == null)
            {
                return BadRequest("Order not found.");
            }

            var delivery = new Delivery
            {
                OrderId = createDeliveryDto.OrderId,
                TrackingNumber = createDeliveryDto.TrackingNumber,
                EstimatedDeliveryDate = createDeliveryDto.EstimatedDeliveryDate,
                Notes = createDeliveryDto.Notes,
                Status = "Pending", // Initial status
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();

            var deliveryDto = new DeliveryDto
            {
                Id = delivery.Id,
                OrderId = delivery.OrderId,
                TrackingNumber = delivery.TrackingNumber,
                EstimatedDeliveryDate = delivery.EstimatedDeliveryDate,
                ActualDeliveryDate = delivery.ActualDeliveryDate,
                Status = delivery.Status,
                Notes = delivery.Notes,
                CreatedAt = delivery.CreatedAt,
                UpdatedAt = delivery.UpdatedAt
            };

            return CreatedAtAction(nameof(GetDelivery), new { id = delivery.Id }, deliveryDto);
        }

        // PUT: api/Deliveries/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateDeliveryStatus(int id, [FromBody] UpdateDeliveryStatusDto updateDeliveryStatusDto)
        {
            var delivery = await _context.Deliveries.FindAsync(id);

            if (delivery == null)
            {
                return NotFound();
            }

            delivery.Status = updateDeliveryStatusDto.Status;
            delivery.ActualDeliveryDate = updateDeliveryStatusDto.ActualDeliveryDate ?? delivery.ActualDeliveryDate;
            delivery.Notes = updateDeliveryStatusDto.Notes ?? delivery.Notes;
            delivery.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryExists(id))
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

        // DELETE: api/Deliveries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDelivery(int id)
        {
            var delivery = await _context.Deliveries.FindAsync(id);
            if (delivery == null)
            {
                return NotFound();
            }

            _context.Deliveries.Remove(delivery);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeliveryExists(int id)
        {
            return _context.Deliveries.Any(e => e.Id == id);
        }
    }
}
