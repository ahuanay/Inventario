using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventarioApi.Data;
using InventarioApi.Models;

namespace InventarioApi.Controllers
{
    [ApiController]
    [Route("api/v1/almacenes")]
    public class AlmacenController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlmacenController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Almacen>>> GetAll([FromQuery] string? search, [FromQuery] bool? es_activo)
        {
            var query = _context.Almacenes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                string lowerSearch = search.ToLower();
                query = query.Where(p =>
                    p.Nombre.ToLower().Contains(lowerSearch) ||
                    p.Codigo.ToLower().Contains(lowerSearch));
            }

            if (es_activo.HasValue)
            {
                query = query.Where(p => p.EsActivo == es_activo.Value);
            }

            var almacenes = await query.OrderBy(a => a.Nombre).ToListAsync();
            return Ok(almacenes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Almacen>> GetById(Guid id)
        {
            var almacen = await _context.Almacenes.FindAsync(id);
            if (almacen == null)
                return NotFound();

            return Ok(almacen);
        }

        [HttpPost]
        public async Task<ActionResult<Almacen>> Save([FromBody] Almacen almacen)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Almacenes.Add(almacen);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = almacen.Id }, almacen);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Almacen>> Update(Guid id, [FromBody] Almacen almacen)
        {
            if (id != almacen.Id)
                return BadRequest("El ID no coincide");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var almacenExistente = await _context.Almacenes.FindAsync(id);
            if (almacenExistente == null)
                return NotFound();

            almacenExistente.Codigo = almacen.Codigo;
            almacenExistente.Nombre = almacen.Nombre;
            almacenExistente.UbigeoCodigoDepartamento = almacen.UbigeoCodigoDepartamento;
            almacenExistente.UbigeoCodigoProvincia = almacen.UbigeoCodigoProvincia;
            almacenExistente.UbigeoCodigoDistrito = almacen.UbigeoCodigoDistrito;
            almacenExistente.UbigeoNombre = almacen.UbigeoNombre;
            almacenExistente.Direccion = almacen.Direccion;
            almacenExistente.EsActivo = almacen.EsActivo;

            _context.Almacenes.Update(almacenExistente);
            await _context.SaveChangesAsync();

            return Ok(almacenExistente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var almacen = await _context.Almacenes.FindAsync(id);
            if (almacen == null)
                return NotFound();

            almacen.DeletedAt = DateTime.UtcNow;
            _context.Almacenes.Update(almacen);
            await _context.SaveChangesAsync();

            return BadRequest("Eliminado");
        }
    }
}
