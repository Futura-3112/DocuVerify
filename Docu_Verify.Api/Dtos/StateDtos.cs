namespace Docu_Verify.Api.Dtos;

public record StateCreateDto(string Name);
public record StateUpdateDto(string Name);
public record StateDto(Guid Id, string Name, DateTime UpdatedAt);
