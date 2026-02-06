namespace Docu_Verify.Api.Dtos;

public record AgeCategoryCreateDto(string Name, int MinAge, int MaxAge);
public record AgeCategoryUpdateDto(string Name, int MinAge, int MaxAge);
public record AgeCategoryDto(Guid Id, string Name, int MinAge, int MaxAge, DateTime UpdatedAt);
