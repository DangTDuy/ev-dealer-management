using Microsoft.EntityFrameworkCore;
using CustomerService.Models; // Ensure Models namespace is included

namespace CustomerService.Data
{
    public class CustomerDbContext : DbContext
    {
        public CustomerDbContext(DbContextOptions<CustomerDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<TestDrive> TestDrives { get; set; }
        public DbSet<Complaint> Complaints { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();

                // A customer can have many test drives
                entity.HasMany(c => c.TestDrives)
                      .WithOne(td => td.Customer)
                      .HasForeignKey(td => td.CustomerId);
            });

            modelBuilder.Entity<TestDrive>(entity =>
            {
                entity.HasKey(e => e.Id);
                // The relationship is already defined from the Customer side,
                // but we can add more configurations for TestDrive here if needed.
            });
        }
    }
}
