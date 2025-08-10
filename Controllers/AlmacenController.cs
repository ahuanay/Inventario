using InventarioApi.Data;
using InventarioApi.Models;
using InventarioApi.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] bool? es_activo,
            [FromQuery] int from = 0,
            [FromQuery] int size = 50)
        {
            var query = _context.Almacenes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(p =>
                    p.Nombre.ToLower().Contains(lowerSearch) ||
                    p.Codigo.ToLower().Contains(lowerSearch));
            }

            if (es_activo.HasValue)
            {
                query = query.Where(p => p.EsActivo == es_activo.Value);
            }

            var total = await query.CountAsync();
            var rows = await query
                .OrderBy(a => a.Nombre)
                .Skip(from)
                .Take(size)
                .ToListAsync();

            var pagedData = new PagedData<Almacen>
            {
                Total = total,
                From = from,
                Size = size,
                Rows = rows
            };

            return Ok(new ApiResponse<PagedData<Almacen>>(pagedData));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(Guid id)
        {
            var almacen = await _context.Almacenes.FindAsync(id);
            if (almacen == null)
                return NotFound(new ApiResponse<object>("Almacén no encontrado."));

            return Ok(new ApiResponse<object>(almacen));
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Almacen almacen)
        {
            var existeCodigo = await _context.Almacenes.AnyAsync(a => a.Codigo == almacen.Codigo);

            if (existeCodigo)
            {
                return BadRequest(new ApiResponse<object>($"El código '{almacen.Codigo}' ya está en uso."));
            }

            almacen.Id = Guid.NewGuid();

            _context.Almacenes.Add(almacen);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = almacen.Id }, new ApiResponse<object>(almacen));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] Almacen almacen)
        {
            if (id != almacen.Id)
                return BadRequest(new ApiResponse<object>("El ID proporcionado no coincide."));

            var almacenExistente = await _context.Almacenes.FindAsync(id);
            if (almacenExistente == null)
                return NotFound(new ApiResponse<object>("Almacén no encontrado."));

            var existeCodigo = await _context.Almacenes.AnyAsync(a => a.Codigo == almacen.Codigo && a.Id != id);

            if (existeCodigo)
            {
                return BadRequest(new ApiResponse<object>($"El código '{almacen.Codigo}' ya está en uso por otro almacén."));
            }

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

            return Ok(new ApiResponse<object>(almacenExistente));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var almacen = await _context.Almacenes.FindAsync(id);
            if (almacen == null)
                return NotFound(new ApiResponse<object>("Almacén no encontrado."));

            almacen.DeletedAt = DateTime.UtcNow;
            _context.Almacenes.Update(almacen);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(new { }));
        }
    }
}