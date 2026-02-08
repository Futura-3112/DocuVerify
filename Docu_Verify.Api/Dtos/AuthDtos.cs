using System.ComponentModel.DataAnnotations;

namespace Docu_Verify.Api.Dtos;

public record UserSyncRequest(
    [Required] string FirebaseUid,
    string? Email,
    string? DisplayName,
    bool IsAnonymous
);

public record UserDto(
    Guid Id,
    string FirebaseUid,
    string? Email,
    string Role,
    DateTime CreatedAt
);
