namespace Docu_Verify.Api.Dtos;

public record SearchResultItemDto(
    Guid DocumentId,
    string DocumentName,
    int SortOrder,
    string? StepDescription
);

public record SearchResultDto(
    Guid ProcessId,
    Guid AgeCategoryId,
    Guid StateId,
    List<SearchResultItemDto> Documents
);
