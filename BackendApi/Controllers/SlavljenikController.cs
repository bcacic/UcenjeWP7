using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Models;
using System.Linq;
using System.Threading.Tasks;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlavljenikController : ControllerBase
    {
        private readonly RodjendanDb _context;

        public SlavljenikController(RodjendanDb context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Slavljenik>>> GetSlavljenici()
        {
            return await _context.Set<Slavljenik>().Include(s => s.Rodjendani).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Slavljenik>> GetSlavljenik(int id)
        {
            var slavljenik = await _context.Set<Slavljenik>().Include(s => s.Rodjendani).FirstOrDefaultAsync(s => s.Sifra == id);

            if (slavljenik == null) return NotFound();

            return slavljenik;
        }

        [HttpPost]
        public async Task<ActionResult<Slavljenik>> PostSlavljenik(Slavljenik slavljenik)
        {
            slavljenik.DatumKreiranja = DateTime.UtcNow;

            _context.Set<Slavljenik>().Add(slavljenik);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSlavljenik), new { id = slavljenik.Sifra }, slavljenik);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSlavljenik(int id, Slavljenik slavljenik)
        {
            if (id != slavljenik.Sifra) return BadRequest();

            slavljenik.DatumAzuriranja = DateTime.UtcNow;

            _context.Entry(slavljenik).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Set<Slavljenik>().Any(e => e.Sifra == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSlavljenik(int id)
        {
            var slavljenik = await _context.Set<Slavljenik>().FindAsync(id);
            if (slavljenik == null) return NotFound();

            _context.Set<Slavljenik>().Remove(slavljenik);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
