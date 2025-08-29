using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CreatorApp.Server.Models.Auth;

namespace CreatorApp.Server.Models
{
    [Table("Pages")]
    public class PageEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public int UserId { get; set; }
        // Navigation (optional)
        public User? User { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string ContentJson { get; set; } = ""; // serialized Element
        [Required]
        public string BindingsJson { get; set; } = ""; // serialized bindings
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
