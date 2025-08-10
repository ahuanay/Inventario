using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("movimientos")]
    public class Movimiento : IAuditableEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "El campo 'Tipo' es obligatorio.")]
        [StringLength(1, ErrorMessage = "El campo 'Tipo' debe tener máximo 1 carácter.")]
        [Column("tipo")]
        public string Tipo { get; set; } = "E";

        [Required(ErrorMessage = "El campo 'Motivo' es obligatorio.")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "El campo 'Motivo' debe tener entre 2 y 20 caracteres.")]
        [Column("motivo")]
        public string Motivo { get; set; } = string.Empty;

        [Column("almacen_origen_id")]
        public Guid? AlmacenOrigenId { get; set; }

        [ForeignKey("AlmacenOrigenId")]
        public virtual Almacen? AlmacenOrigen { get; set; }

        [Column("almacen_destino_id")]
        public Guid? AlmacenDestinoId { get; set; }

        [ForeignKey("AlmacenDestinoId")]
        public virtual Almacen? AlmacenDestino { get; set; }

        [Required(ErrorMessage = "El campo 'ProductoId' es obligatorio.")]
        [Column("producto_id")]
        public Guid ProductoId { get; set; }

        [ForeignKey("ProductoId")]
        public virtual Producto? Producto { get; set; }

        [Required(ErrorMessage = "El campo 'Cantidad' es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El campo 'Cantidad' debe ser mayor a 0.")]
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