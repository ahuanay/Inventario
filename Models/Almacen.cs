using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("almacenes")]
    public class Almacen : IAuditableEntity
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

        [StringLength(10)]
        [Column("ubigeo_codigo_departamento")]
        public string UbigeoCodigoDepartamento { get; set; }

        [StringLength(10)]
        [Column("ubigeo_codigo_provincia")]
        public string UbigeoCodigoProvincia { get; set; }

        [StringLength(10)]
        [Column("ubigeo_codigo_distrito")]
        public string UbigeoCodigoDistrito { get; set; }

        [Required]
        [StringLength(100)]
        [Column("ubigeo_nombre")]
        public string UbigeoNombre { get; set; }

        [Required]
        [StringLength(100)]
        [Column("direccion")]
        public string Direccion { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("deleted_at")]
        public DateTime? DeletedAt { get; set; }

        [JsonIgnore]
        public virtual ICollection<Movimiento> MovimientosOrigen { get; set; } = new HashSet<Movimiento>();

        [JsonIgnore]
        public virtual ICollection<Movimiento> MovimientosDestino { get; set; } = new HashSet<Movimiento>();

        [JsonIgnore]
        public virtual ICollection<Stock> Stock { get; set; } = new HashSet<Stock>();
    }
}
