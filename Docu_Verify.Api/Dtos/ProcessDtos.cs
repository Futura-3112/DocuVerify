namespace Docu_Verify.Api.Dtos;

public record ProcessCreateDto(string Name, string? Description);
public record ProcessUpdateDto(string Name, string? Description);
public record ProcessDto(Guid Id, string Name, string? Description, DateTime UpdatedAt);
