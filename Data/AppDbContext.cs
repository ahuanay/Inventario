using InventarioApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Almacen> Almacenes { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Movimiento> Movimientos { get; set; }
        public DbSet<Stock> Stock { get; set; }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is IAuditableEntity &&
                           (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                var now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = now;
                    entity.UpdatedAt = now;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entity.UpdatedAt = now;
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Almacen>().HasQueryFilter(m => m.DeletedAt == null);
            modelBuilder.Entity<Movimiento>().HasQueryFilter(m => m.DeletedAt == null);
            modelBuilder.Entity<Producto>().HasQueryFilter(p => p.DeletedAt == null);
            modelBuilder.Entity<Stock>().HasQueryFilter(p => p.DeletedAt == null);

            modelBuilder.Entity<Almacen>().HasIndex(a => a.Codigo).IsUnique();

            modelBuilder.Entity<Producto>().HasIndex(p => p.Codigo).IsUnique();

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.AlmacenOrigen)
                .WithMany(a => a.MovimientosOrigen)
                .HasForeignKey(m => m.AlmacenOrigenId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.AlmacenDestino)
                .WithMany(a => a.MovimientosDestino)
                .HasForeignKey(m => m.AlmacenDestinoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.Producto)
                .WithMany(a => a.Movimientos)
                .HasForeignKey(m => m.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Stock>()
                .HasOne(m => m.Producto)
                .WithMany(a => a.Stock)
                .HasForeignKey(m => m.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Stock>()
                .HasOne(m => m.Almacen)
                .WithMany(a => a.Stock)
                .HasForeignKey(m => m.AlmacenId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}