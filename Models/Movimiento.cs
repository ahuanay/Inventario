using Newtonsoft.Json;
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

        [Required]
        [StringLength(1)]
        [Column("tipo")]
        public string Tipo { get; set; } = "E";

        [Required]
        [StringLength(20)]
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

        [Required]
        [Column("producto_id")]
        public Guid ProductoId { get; set; }

        [ForeignKey("ProductoId")]
        public virtual Producto? Producto { get; set; }

        [Required]
        [Column("cantidad")]
        public int Cantidad { get; set; } = 0;

        [StringLength(4)]
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
