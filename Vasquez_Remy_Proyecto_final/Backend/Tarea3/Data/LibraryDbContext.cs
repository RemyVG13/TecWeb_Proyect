using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tarea3.Data.Entities;
using Tarea3.Entities;

namespace Tarea3.Data
{
    public class LibraryDbContext : IdentityDbContext
    {
        public DbSet<ProductionEntity> Productions { get; set; }
        public DbSet<MovieEntity> Movies { get; set; }
        public LibraryDbContext(DbContextOptions<LibraryDbContext> options)
             :base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ProductionEntity>().ToTable("Productions");
            modelBuilder.Entity<ProductionEntity>().Property(p => p.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<ProductionEntity>().HasMany(m => m.Movies).WithOne(p => p.Production);

            modelBuilder.Entity<MovieEntity>().ToTable("Movies");
            modelBuilder.Entity<MovieEntity>().Property(m => m.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<MovieEntity>().HasOne(p => p.Production).WithMany(m => m.Movies);
        }
    }
}
