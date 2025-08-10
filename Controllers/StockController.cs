using InventarioApi.Data;
using InventarioApi.Models;
using InventarioApi.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace InventarioApi.Controllers
{
    [ApiController]
    [Route("api/v1/stock")]
    public class StockController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll(
            [FromQuery] Guid? almacenId,
            [FromQuery] Guid? productoId,
            [FromQuery] int from = 0,
            [FromQuery] int size = 50)
        {
            var query = _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .AsQueryable();

            if (almacenId.HasValue)
                query = query.Where(s => s.AlmacenId == almacenId);

            if (productoId.HasValue)
                query = query.Where(s => s.ProductoId == productoId);

            var total = await query.CountAsync();

            var rows = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip(from)
                .Take(size)
                .Select(MapStock)
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
            var stock = await _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .Where(m => m.Id == id)
                .Select(MapStock)
                .FirstOrDefaultAsync();

            if (stock == null)
                return NotFound(new ApiResponse<object>("Stock no encontrado."));

            return Ok(new ApiResponse<object>(stock));
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Stock stock)
        {
            _context.Stock.Add(stock);
            await _context.SaveChangesAsync();

            var stockConRelaciones = await _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .Where(m => m.Id == stock.Id)
                .Select(MapStock)
                .FirstOrDefaultAsync();

            return CreatedAtAction(nameof(GetById), new { id = stock.Id }, new ApiResponse<object>(stockConRelaciones));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] Stock stock)
        {
            if (id != stock.Id)
                return BadRequest(new ApiResponse<object>("El ID proporcionado no coincide."));

            var stockExistente = await _context.Stock.FindAsync(id);
            if (stockExistente == null)
                return NotFound(new ApiResponse<object>("Stock no encontrado."));

            stockExistente.ProductoId = stock.ProductoId;
            stockExistente.AlmacenId = stock.AlmacenId;
            stockExistente.Cantidad = stock.Cantidad;
            stockExistente.UnidadMedida = stock.UnidadMedida;

            await _context.SaveChangesAsync();

            var stockConRelaciones = await _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .Where(m => m.Id == stock.Id)
                .Select(MapStock)
                .FirstOrDefaultAsync();

            return Ok(new ApiResponse<object>(stockConRelaciones));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var stock = await _context.Stock.FindAsync(id);
            if (stock == null)
                return NotFound(new ApiResponse<object>("Stock no encontrado."));

            stock.DeletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>(new { }));
        }

        private static Expression<Func<Stock, object>> MapStock => m => new
        {
            m.Id,
            m.ProductoId,
            Producto = m.Producto == null ? null : new
            {
                m.Producto.Id,
                m.Producto.Codigo,
                m.Producto.Nombre
            },
            m.AlmacenId,
            Almacen = m.Almacen == null ? null : new
            {
                m.Almacen.Id,
                m.Almacen.Codigo,
                m.Almacen.Nombre
            },
            m.Cantidad,
            m.UnidadMedida,
            m.CreatedAt,
            m.UpdatedAt,
            m.DeletedAt
        };
    }
}