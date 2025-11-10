using Microsoft.EntityFrameworkCore;
using ev_dealer_reporting.Models;

namespace ev_dealer_reporting.Data
{
    public class ReportingDbContext : DbContext
    {
        public ReportingDbContext(DbContextOptions<ReportingDbContext> options) : base(options) { }

        public DbSet<ReportRequest> ReportRequests => Set<ReportRequest>();
        public DbSet<ReportExport> ReportExports => Set<ReportExport>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReportRequest>(eb =>
            {
                eb.HasKey(r => r.Id);
                eb.Property(r => r.Type).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<ReportExport>(eb =>
            {
                eb.HasKey(e => e.Id);
                eb.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                eb.HasOne<ReportRequest>()
                  .WithMany()
                  .HasForeignKey(e => e.ReportRequestId)
                  .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}
