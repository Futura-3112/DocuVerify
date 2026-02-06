namespace Docu_Verify.Api.Models;

public class AgeCategory : BaseEntity
{
    public string Name { get; set; } = default!;
    public int MinAge { get; set; }
    public int MaxAge { get; set; }
}
