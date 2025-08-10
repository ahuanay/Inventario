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

        [Required(ErrorMessage = "El campo 'Código' es obligatorio.")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "El campo 'Código' debe tener entre 2 y 20 caracteres.")]
        [Column("codigo")]
        public string Codigo { get; set; }

        [Required(ErrorMessage = "El campo 'Nombre' es obligatorio.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El campo 'Nombre' debe tener entre 2 y 50 caracteres.")]
        [Column("nombre")]
        public string Nombre { get; set; }

        [StringLength(10, ErrorMessage = "El campo 'Ubigeo Código Departamento' no puede exceder los 10 caracteres.")]
        [Column("ubigeo_codigo_departamento")]
        public string UbigeoCodigoDepartamento { get; set; }

        [StringLength(10, ErrorMessage = "El campo 'Ubigeo Código Provincia' no puede exceder los 10 caracteres.")]
        [Column("ubigeo_codigo_provincia")]
        public string UbigeoCodigoProvincia { get; set; }

        [StringLength(10, ErrorMessage = "El campo 'Ubigeo Código Distrito' no puede exceder los 10 caracteres.")]
        [Column("ubigeo_codigo_distrito")]
        public string UbigeoCodigoDistrito { get; set; }

        [Required(ErrorMessage = "El campo 'Ubigeo Nombre' es obligatorio.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El campo 'Ubigeo Nombre' debe tener entre 2 y 100 caracteres.")]
        [Column("ubigeo_nombre")]
        public string UbigeoNombre { get; set; }

        [Required(ErrorMessage = "El campo 'Dirección' es obligatorio.")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "El campo 'Dirección' debe tener entre 5 y 100 caracteres.")]
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