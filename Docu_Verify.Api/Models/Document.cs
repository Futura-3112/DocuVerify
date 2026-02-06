namespace Docu_Verify.Api.Models;

public class Document : BaseEntity
{
    public string Name { get; set; } = default!;
    public string? Notes { get; set; }
}
