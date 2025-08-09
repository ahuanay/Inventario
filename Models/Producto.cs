using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("productos")]
    public class Producto : IAuditableEntity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("es_activo")]
        public bool EsActivo { get; set; } = true;

        [Required]
        [StringLength(20)]
        [Column("codigo")]
        public string Codigo { get; set; }

        [Required]
        [StringLength(50)]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required]
        [StringLength(100)]
        [Column("nombre_largo")]
        public string NombreLargo { get; set; }

        [Required]
        [StringLength(500)]
        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Required]
        [Column("img_base64")]
        public string ImgBase64 { get; set; }

        [StringLength(4)]
        [Column("unidad_medida")]
        public string UnidadMedida { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("deleted_at")]
        public DateTime? DeletedAt { get; set; }

        [JsonIgnore]
        public virtual ICollection<Movimiento> Movimientos { get; set; } = new HashSet<Movimiento>();

        [JsonIgnore]
        public virtual ICollection<Stock> Stock { get; set; } = new HashSet<Stock>();
    }
}
