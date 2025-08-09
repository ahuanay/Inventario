using InventarioApi.Data;
using InventarioApi.Models;
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
        public async Task<ActionResult<IEnumerable<Stock>>> GetAll()
        {
            var stock = await _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .OrderByDescending(m => m.CreatedAt)
                .Select(MapStock)
                .ToListAsync();
            return Ok(stock);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Stock>> GetById(Guid id)
        {
            var stock = await _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .Where(m => m.Id == id)
                .Select(MapStock)
                .FirstOrDefaultAsync();

            if (stock == null)
                return NotFound();

            return Ok(stock);
        }

        [HttpPost]
        public async Task<ActionResult<Stock>> Save([FromBody] Stock stock)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Stock.Add(stock);
            await _context.SaveChangesAsync();

            var stockConRelaciones = await _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .Where(m => m.Id == stock.Id)
                .Select(MapStock)
                .FirstOrDefaultAsync();

            return CreatedAtAction(nameof(GetById), new { id = stock.Id }, stockConRelaciones);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Stock>> Update(Guid id, [FromBody] Stock stock)
        {
            if (id != stock.Id)
                return BadRequest("El ID no coincide");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var stockExistente = await _context.Stock.FindAsync(id);
            if (stockExistente == null)
                return NotFound();

            stockExistente.ProductoId = stock.ProductoId;
            stockExistente.AlmacenId = stock.AlmacenId;
            stockExistente.Cantidad = stock.Cantidad;
            stockExistente.UnidadMedida = stock.UnidadMedida;

            _context.Stock.Update(stockExistente);
            await _context.SaveChangesAsync();

            var stockConRelaciones = await _context.Stock
                .Include(m => m.Producto)
                .Include(m => m.Almacen)
                .Where(m => m.Id == stock.Id)
                .Select(MapStock)
                .FirstOrDefaultAsync();

            return Ok(stockConRelaciones);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var stock = await _context.Stock.FindAsync(id);
            if (stock == null)
                return NotFound();

            stock.DeletedAt = DateTime.UtcNow;
            _context.Stock.Update(stock);
            await _context.SaveChangesAsync();

            return BadRequest("Eliminado");
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
