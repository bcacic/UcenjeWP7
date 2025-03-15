using Microsoft.EntityFrameworkCore;
namespace BackendApi.Models
{
    class RodjendanDb : DbContext
    {
        public RodjendanDb(DbContextOptions<RodjendanDb> options)
            : base(options) { }

        public DbSet<Rodjendan> Rodjendans => Set<Rodjendan>();
    }
}