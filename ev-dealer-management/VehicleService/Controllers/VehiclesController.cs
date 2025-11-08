using Microsoft.AspNetCore.Mvc;
using VehicleService.DTOs;
using VehicleService.Services;

namespace VehicleService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<VehicleDto>>> GetVehicles([FromQuery] VehicleQueryDto query)
    {
        var result = await _vehicleService.GetVehiclesAsync(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleDto>> GetVehicle(int id)
    {
        var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
        if (vehicle == null)
        {
            return NotFound(new { message = "Vehicle not found" });
        }
        return Ok(vehicle);
    }

    [HttpPost]
    public async Task<ActionResult<VehicleDto>> CreateVehicle(CreateVehicleDto createDto)
    {
        try
        {
            var vehicle = await _vehicleService.CreateVehicleAsync(createDto);
            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VehicleDto>> UpdateVehicle(int id, UpdateVehicleDto updateDto)
    {
        try
        {
            var vehicle = await _vehicleService.UpdateVehicleAsync(id, updateDto);
            if (vehicle == null)
            {
                return NotFound(new { message = "Vehicle not found" });
            }
            return Ok(vehicle);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        var deleted = await _vehicleService.DeleteVehicleAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = "Vehicle not found" });
        }
        return NoContent();
    }
}
