using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RodjendanController : ControllerBase
    {
        private readonly RodjendanDb _context;

        public RodjendanController(RodjendanDb context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));  // Added null-check for clarity

        }

        // GET: api/Rodjendan
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rodjendan>>> GetRodjendani()
        {
            return await _context.Set<Rodjendan>().Include(r => r.SlavljenikNavigation).ToListAsync();
        }

        // GET: api/Rodjendan/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Rodjendan>> GetRodjendan(int id)
        {
            var rodjendan = await _context.Set<Rodjendan>().Include(r => r.SlavljenikNavigation).FirstOrDefaultAsync(r => r.Sifra == id);

            if (rodjendan == null)
            {
                return NotFound();
            }

            return rodjendan;
        }

        // POST: api/Rodjendan
        [HttpPost]
        public async Task<ActionResult<Rodjendan>> PostRodjendan(Rodjendan rodjendan)
        {
            var slavljenik = await _context.Slavljenici.FindAsync(rodjendan.SlavljenikSifra);
            if (slavljenik == null)
            {
                return BadRequest("Slavljenik with the given ID does not exist.");
            }

            _context.Set<Rodjendan>().Add(rodjendan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRodjendan", new { id = rodjendan.Sifra }, rodjendan);
        }

        // PUT: api/Rodjendan/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRodjendan(int id, Rodjendan rodjendan)
        {
            if (id != rodjendan.Sifra)
            {
                return BadRequest();
            }

            var slavljenik = await _context.Slavljenici.FindAsync(rodjendan.SlavljenikSifra);
            if (slavljenik == null)
            {
                return BadRequest("Slavljenik with the given ID does not exist.");
            }

            _context.Entry(rodjendan).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RodjendanExists(id))
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

        // DELETE: api/Rodjendan/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRodjendan(int id)
        {
            var rodjendan = await _context.Set<Rodjendan>().FindAsync(id);
            if (rodjendan == null)
            {
                return NotFound();
            }

            _context.Set<Rodjendan>().Remove(rodjendan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RodjendanExists(int id)
        {
            return _context.Set<Rodjendan>().Any(e => e.Sifra == id);
        }
    }
}
