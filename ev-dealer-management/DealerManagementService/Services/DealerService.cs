using DealerManagementService.Data;
using DealerManagementService.DTOs;
using DealerManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace DealerManagementService.Services;

public class DealerService : IDealerService
{
    private readonly DealerDbContext _context;

    public DealerService(DealerDbContext context)
    {
        _context = context;
    }

    public async Task<List<DealerDto>> GetDealersAsync()
    {
        return await _context.Dealers
            .Select(d => new DealerDto
            {
                Id = d.Id,
                Name = d.Name,
                Region = d.Region,
                Contact = d.Contact,
                Email = d.Email,
                Address = d.Address,
                SalesTarget = d.SalesTarget,
                OutstandingDebt = d.OutstandingDebt,
                Status = d.Status,
                VehicleCount = 0, // Can be populated from VehicleService via API Gateway if needed
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<DealerDto?> GetDealerByIdAsync(int id)
    {
        var dealer = await _context.Dealers.FindAsync(id);
        if (dealer == null) return null;

        return new DealerDto
        {
            Id = dealer.Id,
            Name = dealer.Name,
            Region = dealer.Region,
            Contact = dealer.Contact,
            Email = dealer.Email,
            Address = dealer.Address,
            SalesTarget = dealer.SalesTarget,
            OutstandingDebt = dealer.OutstandingDebt,
            Status = dealer.Status,
            VehicleCount = 0,
            CreatedAt = dealer.CreatedAt,
            UpdatedAt = dealer.UpdatedAt
        };
    }

    public async Task<DealerDto> CreateDealerAsync(CreateDealerDto createDto)
    {
        var dealer = new Dealer
        {
            Name = createDto.Name,
            Region = createDto.Region,
            Contact = createDto.Contact,
            Email = createDto.Email,
            Address = createDto.Address,
            SalesTarget = createDto.SalesTarget,
            Status = createDto.Status ?? "Active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Dealers.Add(dealer);
        await _context.SaveChangesAsync();

        return new DealerDto
        {
            Id = dealer.Id,
            Name = dealer.Name,
            Region = dealer.Region,
            Contact = dealer.Contact,
            Email = dealer.Email,
            Address = dealer.Address,
            SalesTarget = dealer.SalesTarget,
            OutstandingDebt = dealer.OutstandingDebt,
            Status = dealer.Status,
            VehicleCount = 0,
            CreatedAt = dealer.CreatedAt,
            UpdatedAt = dealer.UpdatedAt
        };
    }

    public async Task<DealerDto?> UpdateDealerAsync(int id, UpdateDealerDto updateDto)
    {
        var dealer = await _context.Dealers.FindAsync(id);
        if (dealer == null) return null;

        dealer.Name = updateDto.Name;
        dealer.Region = updateDto.Region;
        dealer.Contact = updateDto.Contact;
        dealer.Email = updateDto.Email;
        dealer.Address = updateDto.Address;
        dealer.SalesTarget = updateDto.SalesTarget;
        dealer.OutstandingDebt = updateDto.OutstandingDebt;
        dealer.Status = updateDto.Status;
        dealer.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetDealerByIdAsync(id);
    }

    public async Task<bool> DeleteDealerAsync(int id)
    {
        var dealer = await _context.Dealers.FindAsync(id);
        if (dealer == null) return false;

        _context.Dealers.Remove(dealer);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<DealerDto>> GetDealersByRegionAsync(string region)
    {
        return await _context.Dealers
            .Where(d => d.Region == region)
            .Select(d => new DealerDto
            {
                Id = d.Id,
                Name = d.Name,
                Region = d.Region,
                Contact = d.Contact,
                Email = d.Email,
                Address = d.Address,
                SalesTarget = d.SalesTarget,
                OutstandingDebt = d.OutstandingDebt,
                Status = d.Status,
                VehicleCount = 0,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            })
            .ToListAsync();
    }
}

