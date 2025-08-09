using InventarioApi.Data;
using InventarioApi.Models;
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
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var movimientos = await _context.Movimientos
                .Include(m => m.Producto)
                .Include(m => m.AlmacenOrigen)
                .Include(m => m.AlmacenDestino)
                .OrderByDescending(m => m.CreatedAt)
                .Select(MapMovimiento)
                .ToListAsync();
            return Ok(movimientos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetById(Guid id)
        {
            var movimiento = await _context.Movimientos
                .Include(m => m.Producto)
                .Include(m => m.AlmacenOrigen)
                .Include(m => m.AlmacenDestino)
                .Where(m => m.Id == id)
                .Select(MapMovimiento)
                .FirstOrDefaultAsync();

            if (movimiento == null) return NotFound();

            return Ok(movimiento);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Save([FromBody] Movimiento movimiento)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (movimiento.Tipo != "E" && movimiento.Tipo != "S")
                return BadRequest("Tipo de movimiento inválido. Debe ser 'E' o 'S'.");

            if (movimiento.Tipo == "E" && movimiento.AlmacenDestinoId == null)
                return BadRequest("Almacén de destino es requerido para entradas.");

            if (movimiento.Tipo == "S" && movimiento.AlmacenOrigenId == null)
                return BadRequest("Almacén de origen es requerido para salidas.");

            Guid almacenId = movimiento.Tipo == "E"
                ? movimiento.AlmacenDestinoId.Value
                : movimiento.AlmacenOrigenId.Value;

            var stock = await _context.Stock
                .FirstOrDefaultAsync(s => s.AlmacenId == almacenId && s.ProductoId == movimiento.ProductoId);

            if (stock == null)
            {
                stock = new Stock
                {
                    ProductoId = movimiento.ProductoId,
                    AlmacenId = almacenId,
                    Cantidad = 0,
                    UnidadMedida = movimiento.UnidadMedida
                };
                _context.Stock.Add(stock);
                await _context.SaveChangesAsync();
            }

            if (stock.UnidadMedida != movimiento.UnidadMedida)
                return BadRequest("La unidad de medida del movimiento no coincide con la del stock.");

            if (movimiento.Tipo == "E")
            {
                stock.Cantidad += movimiento.Cantidad;
            }
            else if (movimiento.Tipo == "S")
            {
                if (stock.Cantidad < movimiento.Cantidad)
                    return BadRequest("No hay suficiente stock para realizar la salida.");

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

            return CreatedAtAction(nameof(GetById), new { id = movimiento.Id }, movimientoConRelaciones);
        }

        private static Expression<Func<Movimiento, object>> MapMovimiento => m => new
        {
            m.Id,
            Tipo = m.Tipo.ToString(),
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
