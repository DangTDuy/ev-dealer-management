using DealerManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace DealerManagementService.Data;

public class DealerDbContext : DbContext
{
    public DealerDbContext(DbContextOptions<DealerDbContext> options) : base(options) { }

    public DbSet<Dealer> Dealers => Set<Dealer>();
    public DbSet<DealerReservation> DealerReservations => Set<DealerReservation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Dealer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Region);
        });

        modelBuilder.Entity<DealerReservation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ReservationId).IsUnique();
            entity.HasIndex(e => e.DealerId);
            entity.Property(e => e.Status).HasMaxLength(100);
            entity.Property(e => e.AssignedStaff).HasMaxLength(200);
        });

        base.OnModelCreating(modelBuilder);
    }
}

