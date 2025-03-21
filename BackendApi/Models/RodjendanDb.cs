using Microsoft.EntityFrameworkCore;

namespace BackendApi.Models
{
    public class RodjendanDb : DbContext
    {
        public RodjendanDb(DbContextOptions<RodjendanDb> options)
            : base(options)
        {}

        public DbSet<Rodjendan> Rodjendani { get; set; }
        public DbSet<Slavljenik> Slavljenici { get; set; }
    }
}
