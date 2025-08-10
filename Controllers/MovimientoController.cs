using InventarioApi.Data;
using InventarioApi.Models;
using InventarioApi.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace InventarioApi.Controllers
{
    [ApiController]
    [Route("api/v1/movimientos")]
    public class MovimientoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovimientoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll(
            [FromQuery] Guid? productoId,
            [FromQuery] Guid? almacenId,
            [FromQuery] string? tipo,
            [FromQuery] int from = 0,
            [FromQuery] int size = 50)
        {
            var query = _context.Movimientos
                .Include(m => m.Producto)
                .Include(m => m.AlmacenOrigen)
                .Include(m => m.AlmacenDestino)
                .AsQueryable();

            if (productoId.HasValue)
                query = query.Where(m => m.ProductoId == productoId);

            if (almacenId.HasValue)
                query = query.Where(m =>
                    m.AlmacenOrigenId == almacenId || m.AlmacenDestinoId == almacenId);

            if (!string.IsNullOrEmpty(tipo))
                query = query.Where(m => m.Tipo == tipo);

            var total = await query.CountAsync();
            var rows = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip(from)
                .Take(size)
                .Select(MapMovimiento)
                .ToListAsync();

            var pagedData = new PagedData<object>
            {
                Total = total,
                From = from,
                Size = size,
                Rows = rows
            };

            return Ok(new ApiResponse<PagedData<object>>(pagedData));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(Guid id)
        {
            var movimiento = await _context.Movimientos
                .Include(m => m.Producto)
                .Include(m => m.AlmacenOrigen)
                .Include(m => m.AlmacenDestino)
                .Where(m => m.Id == id)
                .Select(MapMovimiento)
                .FirstOrDefaultAsync();

            if (movimiento == null)
                return NotFound(new ApiResponse<object>("Movimiento no encontrado."));

            return Ok(new ApiResponse<object>(movimiento));
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Movimiento movimiento)
        {
            if (movimiento.Tipo != "E" && movimiento.Tipo != "S")
                return BadRequest(new ApiResponse<object>("Tipo de movimiento inválido. Debe ser 'E' o 'S'."));

            if (movimiento.Tipo == "E" && movimiento.AlmacenDestinoId == null)
                return BadRequest(new ApiResponse<object>("Almacén de destino es requerido para entradas."));

            if (movimiento.Tipo == "S" && movimiento.AlmacenOrigenId == null)
                return BadRequest(new ApiResponse<object>("Almacén de origen es requerido para salidas."));

            Guid almacenId = movimiento.Tipo == "E"
                ? movimiento.AlmacenDestinoId!.Value
                : movimiento.AlmacenOrigenId!.Value;

            var stock = await _context.Stock
                .FirstOrDefaultAsync(s =>
                    s.ProductoId == movimiento.ProductoId &&
                    s.AlmacenId == almacenId);

            if (stock == null)
            {
                stock = new Stock
                {
                    ProductoId = movimiento.ProductoId,
                    AlmacenId = almacenId,
                    UnidadMedida = movimiento.UnidadMedida,
                    Cantidad = 0
                };
                _context.Stock.Add(stock);
                await _context.SaveChangesAsync();
            }

            if (stock.UnidadMedida != movimiento.UnidadMedida)
            {
                return BadRequest(new ApiResponse<object>("La unidad de medida del movimiento no coincide con la del stock."));
            }

            if (movimiento.Tipo == "E")
            {
                stock.Cantidad += movimiento.Cantidad;
            }
            else // Tipo == "S"
            {
                if (stock.Cantidad < movimiento.Cantidad)
                    return BadRequest(new ApiResponse<object>("No hay suficiente stock para realizar la salida."));

                stock.Cantidad -= movimiento.Cantidad;
            }

            _context.Movimientos.Add(movimiento);
            await _context.SaveChangesAsync();

            var movimientoConRelaciones = await _context.Movimientos
                .Include(m => m.Producto)
                .Include(m => m.AlmacenOrigen)
                .Include(m => m.AlmacenDestino)
                .Where(m => m.Id == movimiento.Id)
                .Select(MapMovimiento)
                .FirstOrDefaultAsync();

            return CreatedAtAction(nameof(GetById), new { id = movimiento.Id }, new ApiResponse<object>(movimientoConRelaciones));
        }

        private static Expression<Func<Movimiento, object>> MapMovimiento => m => new
        {
            m.Id,
            m.Tipo,
            m.Motivo,
            m.Cantidad,
            m.UnidadMedida,
            m.ProductoId,
            Producto = m.Producto == null ? null : new
            {
                m.Producto.Id,
                m.Producto.Codigo,
                m.Producto.Nombre
            },
            m.AlmacenOrigenId,
            AlmacenOrigen = m.AlmacenOrigen == null ? null : new
            {
                m.AlmacenOrigen.Id,
                m.AlmacenOrigen.Codigo,
                m.AlmacenOrigen.Nombre
            },
            m.AlmacenDestinoId,
            AlmacenDestino = m.AlmacenDestino == null ? null : new
            {
                m.AlmacenDestino.Id,
                m.AlmacenDestino.Codigo,
                m.AlmacenDestino.Nombre
            },
            m.CreatedAt,
            m.UpdatedAt,
            m.DeletedAt
        };
    }
}