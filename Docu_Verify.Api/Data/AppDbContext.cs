using Docu_Verify.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<State> States => Set<State>();
    public DbSet<AgeCategory> AgeCategories => Set<AgeCategory>();
    public DbSet<Process> Processes => Set<Process>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Requirement> Requirements => Set<Requirement>();
    public DbSet<User> Users => Set<User>();

    public override int SaveChanges()
    {
        TouchUpdatedAt();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        TouchUpdatedAt();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void TouchUpdatedAt()
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Soft delete filters
        modelBuilder.Entity<State>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<AgeCategory>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Process>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Document>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Requirement>().HasQueryFilter(x => !x.IsDeleted);

        // Uniqueness
        modelBuilder.Entity<State>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<AgeCategory>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<Process>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<Document>().HasIndex(x => x.Name).IsUnique();

        // Prevent duplicate requirement mapping
        modelBuilder.Entity<Requirement>()
            .HasIndex(x => new { x.ProcessId, x.AgeCategoryId, x.StateId, x.DocumentId })
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}
