using VehicleService.DTOs;
using VehicleService.Models;

namespace VehicleService.Services;

public interface IVehicleService
{
    Task<PaginatedResult<VehicleDto>> GetVehiclesAsync(VehicleQueryDto query);
    Task<VehicleDto?> GetVehicleByIdAsync(int id);
    Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto createDto, List<IFormFile>? imageFiles = null);
    Task<VehicleDto?> UpdateVehicleAsync(int id, UpdateVehicleDto updateDto, List<IFormFile>? imageFiles = null);
    Task<bool> DeleteVehicleAsync(int id);
    Task<List<DealerDto>> GetDealersAsync();
    Task<DealerDto?> GetDealerByIdAsync(int id);
    Task<DealerDto> CreateDealerAsync(CreateDealerDto createDto);
    Task<DealerDto?> UpdateDealerAsync(int id, UpdateDealerDto updateDto);
    Task<bool> DeleteDealerAsync(int id);
    Task<List<VehicleType>> GetVehicleTypesAsync();
    Task<ReservationDto> ReserveVehicleAsync(int vehicleId, CreateReservationDto createDto);
    Task<ReservationDto?> GetReservationByIdAsync(int id);
    Task<PaginatedResult<ReservationDto>> GetReservationsAsync(ReservationQueryDto query);
}
