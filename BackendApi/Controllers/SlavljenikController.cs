using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlavljenikController : ControllerBase
    {
        private readonly RodjendanDb _context;

        public SlavljenikController(RodjendanDb context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // GET: api/Slavljenik
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Slavljenik>>> GetSlavljenici()
        {
            // return await _context.Set<Rodjendan>().Include(r => r.SlavljenikNavigation).ToListAsync();
            return await _context.Set<Slavljenik>().Include(s => s.Rodjendani).ToListAsync();
        }

        // GET: api/Slavljenik/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Slavljenik>> GetSlavljenik(int id)
        {
            var slavljenik = await _context.Set<Slavljenik>().Include(s => s.Rodjendani).FirstOrDefaultAsync(s => s.Sifra == id);

            if (slavljenik == null)
            {
                return NotFound();
            }

            return slavljenik;
        }

        // POST: api/Slavljenik
        [HttpPost]
        public async Task<ActionResult<Slavljenik>> PostSlavljenik(Slavljenik slavljenik)
        {
            _context.Set<Slavljenik>().Add(slavljenik);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSlavljenik", new { id = slavljenik.Sifra }, slavljenik);
        }

        // PUT: api/Slavljenik/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSlavljenik(int id, Slavljenik slavljenik)
        {
            if (id != slavljenik.Sifra)
            {
                return BadRequest();
            }

            _context.Entry(slavljenik).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SlavljenikExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Slavljenik/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSlavljenik(int id)
        {
            var slavljenik = await _context.Set<Slavljenik>().FindAsync(id);
            if (slavljenik == null)
            {
                return NotFound();
            }

            _context.Set<Slavljenik>().Remove(slavljenik);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SlavljenikExists(int id)
        {
            return _context.Set<Slavljenik>().Any(e => e.Sifra == id);
        }
    }
}
