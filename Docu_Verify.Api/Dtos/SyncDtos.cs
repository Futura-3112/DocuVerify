using Docu_Verify.Api.Models;

namespace Docu_Verify.Api.Dtos;

public record SyncResponseDto(
    DateTime ServerTime,
    List<State> States,
    List<AgeCategory> AgeCategories,
    List<Process> Processes,
    List<Document> Documents,
    List<Requirement> Requirements
);
