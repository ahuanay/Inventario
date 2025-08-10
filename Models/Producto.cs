using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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

        [Required(ErrorMessage = "El campo 'EsActivo' es obligatorio.")]
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

        [Required(ErrorMessage = "El campo 'Nombre Largo' es obligatorio.")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "El campo 'Nombre Largo' debe tener entre 5 y 100 caracteres.")]
        [Column("nombre_largo")]
        public string NombreLargo { get; set; }

        [Required(ErrorMessage = "El campo 'Descripción' es obligatorio.")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "El campo 'Descripción' debe tener entre 10 y 500 caracteres.")]
        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "El campo 'Imagen Base64' es obligatorio.")]
        [Column("img_base64")]
        public string ImgBase64 { get; set; }

        [StringLength(4, ErrorMessage = "El campo 'Unidad de Medida' no puede exceder 4 caracteres.")]
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