using DealerManagementService.Data;
using DealerManagementService.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DealerManagementService.Controllers
{
    [ApiController]
    [Route("api/processed-reservations")]
    public class ProcessedReservationsController : ControllerBase
    {
        private readonly DealerDbContext _dbContext;

        public ProcessedReservationsController(DealerDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DealerReservationDto>>> GetAll([FromQuery] int? dealerId, [FromQuery] int? reservationId)
        {
            var query = _dbContext.DealerReservations.AsQueryable();

            if (dealerId.HasValue)
            {
                query = query.Where(r => r.DealerId == dealerId.Value);
            }

            if (reservationId.HasValue)
            {
                query = query.Where(r => r.ReservationId == reservationId.Value);
            }

            var results = await query
                .OrderByDescending(r => r.ProcessedAt)
                .Select(r => new DealerReservationDto
                {
                    Id = r.Id,
                    ReservationId = r.ReservationId,
                    VehicleId = r.VehicleId,
                    DealerId = r.DealerId,
                    Status = r.Status,
                    AssignedStaff = r.AssignedStaff,
                    ProcessedAt = r.ProcessedAt,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(results);
    }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<DealerReservationDto>> GetById(int id)
        {
            var entity = await _dbContext.DealerReservations.FindAsync(id);
            if (entity == null)
            {
                return NotFound();
            }

            var dto = new DealerReservationDto
            {
                Id = entity.Id,
                ReservationId = entity.ReservationId,
                VehicleId = entity.VehicleId,
                DealerId = entity.DealerId,
                Status = entity.Status,
                AssignedStaff = entity.AssignedStaff,
                ProcessedAt = entity.ProcessedAt,
                CreatedAt = entity.CreatedAt
            };

            return Ok(dto);
        }
    }
}

