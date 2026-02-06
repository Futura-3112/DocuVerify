namespace Docu_Verify.Api.Models;

public class Requirement : BaseEntity
{
    public Guid ProcessId { get; set; }
    public Process Process { get; set; } = default!;

    public Guid AgeCategoryId { get; set; }
    public AgeCategory AgeCategory { get; set; } = default!;

    // NULL = All India
    public Guid? StateId { get; set; }
    public State? State { get; set; }

    public Guid DocumentId { get; set; }
    public Document Document { get; set; } = default!;

    public int SortOrder { get; set; } = 0;
    public string? StepDescription { get; set; }
}
