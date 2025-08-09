using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventarioApi.Data;
using InventarioApi.Models;

namespace InventarioApi.Controllers
{
    [ApiController]
    [Route("api/v1/productos")]
    public class ProductoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetAll([FromQuery] string? search, [FromQuery] bool? es_activo)
        {
            var query = _context.Productos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                string lowerSearch = search.ToLower();
                query = query.Where(p =>
                    p.Nombre.ToLower().Contains(lowerSearch) ||
                    p.Codigo.ToLower().Contains(lowerSearch) ||
                    p.Descripcion.ToLower().Contains(lowerSearch));
            }

            if (es_activo.HasValue)
            {
                query = query.Where(p => p.EsActivo == es_activo.Value);
            }

            var productos = await _context.Productos.OrderBy(p => p.Nombre).ToListAsync();
            return Ok(productos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetById(Guid id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();
            return Ok(producto);
        }

        [HttpPost]
        public async Task<ActionResult<Producto>> Save([FromBody] Producto producto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = producto.Id }, producto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Producto>> Update(Guid id, [FromBody] Producto producto)
        {
            if (id != producto.Id)
                return BadRequest("El ID no coincide");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var productoExistente = await _context.Productos.FindAsync(id);
            if (productoExistente == null) return NotFound();

            productoExistente.Codigo = producto.Codigo;
            productoExistente.Nombre = producto.Nombre;
            productoExistente.NombreLargo = producto.NombreLargo;
            productoExistente.Descripcion = producto.Descripcion;
            productoExistente.ImgBase64 = producto.ImgBase64;
            productoExistente.UnidadMedida = producto.UnidadMedida;
            productoExistente.EsActivo = producto.EsActivo;

            _context.Productos.Update(productoExistente);
            await _context.SaveChangesAsync();

            return Ok(productoExistente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            producto.DeletedAt = DateTime.UtcNow;
            _context.Productos.Update(producto);
            await _context.SaveChangesAsync();

            return BadRequest("Eliminado");
        }
    }
}
