using DealerManagementService.DTOs;

namespace DealerManagementService.Services;

public interface IDealerService
{
    Task<List<DealerDto>> GetDealersAsync();
    Task<DealerDto?> GetDealerByIdAsync(int id);
    Task<DealerDto> CreateDealerAsync(CreateDealerDto createDto);
    Task<DealerDto?> UpdateDealerAsync(int id, UpdateDealerDto updateDto);
    Task<bool> DeleteDealerAsync(int id);
    Task<List<DealerDto>> GetDealersByRegionAsync(string region);
}

