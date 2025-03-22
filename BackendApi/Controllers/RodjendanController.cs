using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Models;
using System.Linq;
using System.Threading.Tasks;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RodjendanController : ControllerBase
    {
        private readonly RodjendanDb _context;

        public RodjendanController(RodjendanDb context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rodjendan>>> GetRodjendani()
        {
            return await _context.Set<Rodjendan>().Include(r => r.SlavljenikNavigation).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Rodjendan>> GetRodjendan(int id)
        {
            var rodjendan = await _context.Set<Rodjendan>()
                .Include(r => r.SlavljenikNavigation)
                .FirstOrDefaultAsync(r => r.Sifra == id);

            if (rodjendan == null) return NotFound();

            return rodjendan;
        }

        [HttpPost]
        public async Task<ActionResult<Rodjendan>> PostRodjendan(Rodjendan rodjendan)
        {
            rodjendan.DatumKreiranja = DateTime.UtcNow;

            _context.Set<Rodjendan>().Add(rodjendan);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRodjendan), new { id = rodjendan.Sifra }, rodjendan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRodjendan(int id, Rodjendan rodjendan)
        {
            if (id != rodjendan.Sifra) return BadRequest();

            rodjendan.DatumAzuriranja = DateTime.UtcNow;

            _context.Entry(rodjendan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Set<Rodjendan>().Any(e => e.Sifra == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRodjendan(int id)
        {
            var rodjendan = await _context.Set<Rodjendan>().FindAsync(id);
            if (rodjendan == null) return NotFound();

            _context.Set<Rodjendan>().Remove(rodjendan);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
