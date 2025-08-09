namespace InventarioApi.Models
{
    public interface IAuditableEntity
    {
        DateTime CreatedAt { get; set; }

        DateTime UpdatedAt { get; set; }

        DateTime? DeletedAt { get; set; }
    }
}
