using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesService.Data;
using SalesService.Models;

namespace SalesService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProcessedReservationsController : ControllerBase
{
    private readonly SalesDbContext _context;
    private readonly ILogger<ProcessedReservationsController> _logger;

    public ProcessedReservationsController(
        SalesDbContext context,
        ILogger<ProcessedReservationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all processed reservations
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProcessedReservation>>> GetAll(
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] int? dealerId = null)
    {
        var query = _context.ProcessedReservations.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Status == status);
        }

        if (dealerId.HasValue)
        {
            query = query.Where(r => r.DealerId == dealerId.Value);
        }

        query = query.OrderByDescending(r => r.ProcessedAt);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip(((page ?? 1) - 1) * (pageSize ?? 20))
            .Take(pageSize ?? 20)
            .ToListAsync();

        return Ok(new
        {
            Items = items,
            TotalCount = totalCount,
            Page = page ?? 1,
            PageSize = pageSize ?? 20,
            TotalPages = (int)Math.Ceiling(totalCount / (double)(pageSize ?? 20))
        });
    }

    /// <summary>
    /// Get processed reservation by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProcessedReservation>> GetById(int id)
    {
        var reservation = await _context.ProcessedReservations.FindAsync(id);

        if (reservation == null)
        {
            return NotFound();
        }

        return Ok(reservation);
    }

    /// <summary>
    /// Get processed reservation by original ReservationId
    /// </summary>
    [HttpGet("by-reservation/{reservationId}")]
    public async Task<ActionResult<ProcessedReservation>> GetByReservationId(int reservationId)
    {
        var reservation = await _context.ProcessedReservations
            .FirstOrDefaultAsync(r => r.ReservationId == reservationId);

        if (reservation == null)
        {
            return NotFound();
        }

        return Ok(reservation);
    }

    /// <summary>
    /// Get statistics/summary of processed reservations
    /// </summary>
    [HttpGet("statistics")]
    public async Task<ActionResult> GetStatistics()
    {
        var total = await _context.ProcessedReservations.CountAsync();
        var byStatus = await _context.ProcessedReservations
            .GroupBy(r => r.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var today = await _context.ProcessedReservations
            .CountAsync(r => r.ProcessedAt.Date == DateTime.UtcNow.Date);

        var thisWeek = await _context.ProcessedReservations
            .CountAsync(r => r.ProcessedAt >= DateTime.UtcNow.AddDays(-7));

        return Ok(new
        {
            Total = total,
            Today = today,
            ThisWeek = thisWeek,
            ByStatus = byStatus
        });
    }

    /// <summary>
    /// Get recent processed reservations
    /// </summary>
    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<ProcessedReservation>>> GetRecent(
        [FromQuery] int limit = 10)
    {
        var reservations = await _context.ProcessedReservations
            .OrderByDescending(r => r.ProcessedAt)
            .Take(limit)
            .ToListAsync();

        return Ok(reservations);
    }
}

