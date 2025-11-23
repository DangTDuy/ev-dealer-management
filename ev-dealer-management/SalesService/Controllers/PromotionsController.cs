using Microsoft.AspNetCore.Mvc;
using SalesService.DTOs;
using SalesService.Models;
using SalesService.Data;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionsController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public PromotionsController(SalesDbContext context)
        {
            _context = context;
        }

        // GET: api/Promotions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetPromotions()
        {
            var promotions = await _context.Promotions
                .Select(p => new PromotionDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    DiscountValue = p.DiscountValue,
                    DiscountType = p.DiscountType,
                    ApplicableTo = p.ApplicableTo,
                    VehicleId = p.VehicleId,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return Ok(promotions);
        }

        // GET: api/Promotions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PromotionDto>> GetPromotion(int id)
        {
            var promotion = await _context.Promotions.FindAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            var promotionDto = new PromotionDto
            {
                Id = promotion.Id,
                Name = promotion.Name,
                Description = promotion.Description,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                DiscountValue = promotion.DiscountValue,
                DiscountType = promotion.DiscountType,
                ApplicableTo = promotion.ApplicableTo,
                VehicleId = promotion.VehicleId,
                IsActive = promotion.IsActive,
                CreatedAt = promotion.CreatedAt,
                UpdatedAt = promotion.UpdatedAt
            };

            return Ok(promotionDto);
        }

        // POST: api/Promotions
        [HttpPost]
        public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] CreatePromotionDto createPromotionDto)
        {
            var promotion = new Promotion
            {
                Name = createPromotionDto.Name,
                Description = createPromotionDto.Description,
                StartDate = createPromotionDto.StartDate,
                EndDate = createPromotionDto.EndDate,
                DiscountValue = createPromotionDto.DiscountValue,
                DiscountType = createPromotionDto.DiscountType,
                ApplicableTo = createPromotionDto.ApplicableTo,
                VehicleId = createPromotionDto.VehicleId,
                IsActive = true, // New promotions are active by default
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            var promotionDto = new PromotionDto
            {
                Id = promotion.Id,
                Name = promotion.Name,
                Description = promotion.Description,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                DiscountValue = promotion.DiscountValue,
                DiscountType = promotion.DiscountType,
                ApplicableTo = promotion.ApplicableTo,
                VehicleId = promotion.VehicleId,
                IsActive = promotion.IsActive,
                CreatedAt = promotion.CreatedAt,
                UpdatedAt = promotion.UpdatedAt
            };

            return CreatedAtAction(nameof(GetPromotion), new { id = promotion.Id }, promotionDto);
        }

        // PUT: api/Promotions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePromotion(int id, [FromBody] UpdatePromotionDto updatePromotionDto)
        {
            var promotion = await _context.Promotions.FindAsync(id);

            if (promotion == null)
            {
                return NotFound();
            }

            promotion.Name = updatePromotionDto.Name ?? promotion.Name;
            promotion.Description = updatePromotionDto.Description ?? promotion.Description;
            promotion.StartDate = updatePromotionDto.StartDate ?? promotion.StartDate;
            promotion.EndDate = updatePromotionDto.EndDate ?? promotion.EndDate;
            promotion.DiscountValue = updatePromotionDto.DiscountValue ?? promotion.DiscountValue;
            promotion.DiscountType = updatePromotionDto.DiscountType ?? promotion.DiscountType;
            promotion.ApplicableTo = updatePromotionDto.ApplicableTo ?? promotion.ApplicableTo;
            promotion.VehicleId = updatePromotionDto.VehicleId ?? promotion.VehicleId;
            promotion.IsActive = updatePromotionDto.IsActive ?? promotion.IsActive;
            promotion.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PromotionExists(id))
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

        // DELETE: api/Promotions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            var promotion = await _context.Promotions.FindAsync(id);
            if (promotion == null)
            {
                return NotFound();
            }

            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PromotionExists(int id)
        {
            return _context.Promotions.Any(e => e.Id == id);
        }
    }
}
