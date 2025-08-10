using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventarioApi.Data;
using InventarioApi.Models;
using InventarioApi.Responses;

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
        public async Task<ActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] bool? es_activo,
            [FromQuery] int from = 0,
            [FromQuery] int size = 50)
        {
            var query = _context.Productos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(p =>
                    p.Nombre.ToLower().Contains(lowerSearch) ||
                    p.Codigo.ToLower().Contains(lowerSearch) ||
                    p.Descripcion.ToLower().Contains(lowerSearch));
            }

            if (es_activo.HasValue)
            {
                query = query.Where(p => p.EsActivo == es_activo.Value);
            }

            var total = await query.CountAsync();
            var rows = await query
                .OrderBy(p => p.Nombre)
                .Skip(from)
                .Take(size)
                .ToListAsync();

            var pagedData = new PagedData<Producto>
            {
                Total = total,
                From = from,
                Size = size,
                Rows = rows
            };

            return Ok(new ApiResponse<PagedData<Producto>>(pagedData));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(Guid id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound(new ApiResponse<object>("Producto no encontrado."));

            return Ok(new ApiResponse<object>(producto));
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Producto producto)
        {
            var existeCodigo = await _context.Productos
                .AnyAsync(p => p.Codigo == producto.Codigo);

            if (existeCodigo)
            {
                return BadRequest(new ApiResponse<object>($"El código '{producto.Codigo}' ya está en uso."));
            }

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = producto.Id }, new ApiResponse<object>(producto));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] Producto producto)
        {
            if (id != producto.Id)
                return BadRequest(new ApiResponse<object>("El ID proporcionado no coincide."));

            var productoExistente = await _context.Productos.FindAsync(id);
            if (productoExistente == null)
                return NotFound(new ApiResponse<object>("Producto no encontrado."));

            var existeCodigo = await _context.Productos
                .AnyAsync(p => p.Codigo == producto.Codigo && p.Id != id);

            if (existeCodigo)
            {
                return BadRequest(new ApiResponse<object>($"El código '{producto.Codigo}' ya está en uso por otro producto."));
            }

            productoExistente.Codigo = producto.Codigo;
            productoExistente.Nombre = producto.Nombre;
            productoExistente.NombreLargo = producto.NombreLargo;
            productoExistente.Descripcion = producto.Descripcion;
            productoExistente.ImgBase64 = producto.ImgBase64;
            productoExistente.UnidadMedida = producto.UnidadMedida;
            productoExistente.EsActivo = producto.EsActivo;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(productoExistente));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound(new ApiResponse<object>("Producto no encontrado."));

            producto.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(new { }));
        }
    }
}