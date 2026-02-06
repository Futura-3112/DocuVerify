namespace Docu_Verify.Api.Dtos;

public record DocumentCreateDto(string Name, string? Notes);
public record DocumentUpdateDto(string Name, string? Notes);
public record DocumentDto(Guid Id, string Name, string? Notes, DateTime UpdatedAt);
