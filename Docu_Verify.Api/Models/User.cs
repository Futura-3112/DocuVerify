using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Models;

[Index(nameof(FirebaseUid), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
public class User : BaseEntity
{
    [Required]
    [MaxLength(128)]
    public required string FirebaseUid { get; set; }

    [MaxLength(256)]
    public string? Email { get; set; }

    public string? DisplayName { get; set; }
    
    public bool IsAnonymous { get; set; }

    public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;

    // "Admin", "User", "Guest"
    public string Role { get; set; } = "User"; 
}
