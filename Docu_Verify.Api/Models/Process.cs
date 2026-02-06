namespace Docu_Verify.Api.Models;

public class Process : BaseEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
}
