using CreatorApp.Server.Models.Auth;
using Microsoft.EntityFrameworkCore;
using CreatorApp.Server.Models;

namespace CreatorApp.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users => Set<User>();
        public DbSet<PageEntity> Pages => Set<PageEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(b =>
            {
                b.HasKey(u => u.Id);
                b.ToTable("Users");
                b.HasIndex(u => u.Email).IsUnique();
                b.Property(u => u.Email).IsRequired().HasMaxLength(256);
                b.Property(u => u.PasswordHash).IsRequired();
            });
            modelBuilder.Entity<PageEntity>(b =>
            {
                b.HasKey(p => p.Id);
                b.ToTable("Pages");
                b.HasIndex(p => new { p.UserId, p.Name }).IsUnique(false);
                b.Property(p => p.UserId).IsRequired();
                b.HasOne(p => p.User)
                 .WithMany()
                 .HasForeignKey(p => p.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
