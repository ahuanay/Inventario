using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("stock")]
    public class Stock : IAuditableEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "El campo 'ProductoId' es obligatorio.")]
        [Column("producto_id")]
        public Guid ProductoId { get; set; }

        [ForeignKey("ProductoId")]
        public virtual Producto? Producto { get; set; }

        [Required(ErrorMessage = "El campo 'AlmacenId' es obligatorio.")]
        [Column("almacen_id")]
        public Guid AlmacenId { get; set; }

        [ForeignKey("AlmacenId")]
        public virtual Almacen? Almacen { get; set; }

        [Required(ErrorMessage = "El campo 'Cantidad' es obligatorio.")]
        [Range(0, int.MaxValue, ErrorMessage = "El campo 'Cantidad' debe ser igual o mayor a 0.")]
        [Column("cantidad")]
        public int Cantidad { get; set; } = 0;

        [StringLength(4, ErrorMessage = "El campo 'Unidad de Medida' no puede exceder 4 caracteres.")]
        [Column("unidad_medida")]
        public string UnidadMedida { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("deleted_at")]
        public DateTime? DeletedAt { get; set; }
    }
}