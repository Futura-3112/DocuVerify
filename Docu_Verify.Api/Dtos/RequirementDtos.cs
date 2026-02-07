namespace Docu_Verify.Api.Dtos;

public record RequirementUpsertItemDto(
    Guid DocumentId,
    int SortOrder,
    string? StepDescription
);

public record RequirementUpsertRequestDto(
    Guid ProcessId,
    Guid AgeCategoryId,
    Guid? StateId, // null = All India
    List<RequirementUpsertItemDto> Items
);

public record RequirementDto(
    Guid Id,
    Guid ProcessId,
    Guid AgeCategoryId,
    Guid? StateId,
    Guid DocumentId,
    int SortOrder,
    string? StepDescription,
    DateTime UpdatedAt
);
