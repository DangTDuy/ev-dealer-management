using DealerManagementService.DTOs;
using DealerManagementService.Services;
using Microsoft.AspNetCore.Mvc;

namespace DealerManagementService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DealersController : ControllerBase
{
    private readonly IDealerService _dealerService;

    public DealersController(IDealerService dealerService)
    {
        _dealerService = dealerService;
    }

    [HttpGet]
    public async Task<ActionResult<List<DealerDto>>> GetDealers([FromQuery] string? region)
    {
        if (!string.IsNullOrWhiteSpace(region))
        {
            var dealers = await _dealerService.GetDealersByRegionAsync(region);
            return Ok(dealers);
        }

        var allDealers = await _dealerService.GetDealersAsync();
        return Ok(allDealers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DealerDto>> GetDealer(int id)
    {
        var dealer = await _dealerService.GetDealerByIdAsync(id);
        if (dealer == null)
        {
            return NotFound(new { message = "Dealer not found" });
        }
        return Ok(dealer);
    }

    [HttpPost]
    public async Task<ActionResult<DealerDto>> CreateDealer(CreateDealerDto createDto)
    {
        try
        {
            var dealer = await _dealerService.CreateDealerAsync(createDto);
            return CreatedAtAction(nameof(GetDealer), new { id = dealer.Id }, dealer);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DealerDto>> UpdateDealer(int id, UpdateDealerDto updateDto)
    {
        try
        {
            var dealer = await _dealerService.UpdateDealerAsync(id, updateDto);
            if (dealer == null)
            {
                return NotFound(new { message = "Dealer not found" });
            }
            return Ok(dealer);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDealer(int id)
    {
        var deleted = await _dealerService.DeleteDealerAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = "Dealer not found" });
        }
        return NoContent();
    }
}

