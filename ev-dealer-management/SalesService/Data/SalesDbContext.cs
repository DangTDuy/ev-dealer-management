using Microsoft.EntityFrameworkCore;
using SalesService.Models;
// Remove using Microsoft.Extensions.Logging;

namespace SalesService.Data
{
    public class SalesDbContext : DbContext
    {
        public SalesDbContext(DbContextOptions<SalesDbContext> options) : base(options)
        {
            // Remove logging from constructor
        }

        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ProcessedReservation> ProcessedReservations => Set<ProcessedReservation>();
        public DbSet<Reservation> Reservations { get; set; }

        // Remove OnConfiguring method
        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     if (!optionsBuilder.IsConfigured)
        //     {
        //         optionsBuilder.UseSqlite("Data Source=sales.db");
        //     }
            
        //     var connectionString = optionsBuilder.Options.FindExtension<Microsoft.EntityFrameworkCore.Sqlite.Infrastructure.Internal.SqliteOptionsExtension>()?.ConnectionString;
        //     if (connectionString != null && connectionString.Contains("Data Source="))
        //     {
        //         var filePath = connectionString.Split("Data Source=")[1].Split(";")[0];
        //         Console.WriteLine($"[SalesDbContext] SQLite database file path: {filePath}");
        //     }
        //     else
        //     {
        //         Console.WriteLine($"[SalesDbContext] Could not determine SQLite database file path from connection string: {connectionString}");
        //     }
        //     base.OnConfiguring(optionsBuilder);
        // }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProcessedReservation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.ReservationId);
                entity.HasIndex(e => e.ProcessedAt);
                entity.HasIndex(e => e.DealerId);
                entity.Property(e => e.Status).HasMaxLength(100);
                entity.Property(e => e.AssignedStaff).HasMaxLength(200);
                entity.Property(e => e.VehicleId).HasMaxLength(50);
            });

            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CustomerName).IsRequired();
                entity.Property(e => e.CustomerEmail).IsRequired();
                entity.Property(e => e.CustomerPhone).IsRequired();
                entity.Property(e => e.Quantity).IsRequired();
                entity.Property(e => e.ReservationDate).IsRequired();
            });
        }
    }
}
