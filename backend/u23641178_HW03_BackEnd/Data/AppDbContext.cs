using Microsoft.EntityFrameworkCore;
using u23641178_HW03_BackEnd.Models;

namespace u23641178_HW03_BackEnd.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }

        public DbSet<WatchlistMovie> WatchlistMovies { get; set; }

        public DbSet<WatchedMovie> WatchedMovies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                .HasIndex(user => user.Email)
                .IsUnique();

            modelBuilder.Entity<WatchlistMovie>()
                .HasOne(movie => movie.AppUser)
                .WithMany(user => user.WatchlistMovies)
                .HasForeignKey(movie => movie.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WatchedMovie>()
                .HasOne(movie => movie.AppUser)
                .WithMany(user => user.WatchedMovies)
                .HasForeignKey(movie => movie.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}