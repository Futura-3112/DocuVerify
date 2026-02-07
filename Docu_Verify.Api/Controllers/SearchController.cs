using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly AppDbContext _db;
    public SearchController(AppDbContext db) => _db = db;

    // GET /api/search?processId=&ageCategoryId=&stateId=
    [HttpGet]
    public async Task<ActionResult<SearchResultDto>> Search(
        [FromQuery] Guid processId,
        [FromQuery] Guid ageCategoryId,
        [FromQuery] Guid stateId)
    {
        // 1️⃣ Fetch state-specific rules
        var stateSpecific = await _db.Requirements
            .Where(r =>
                r.ProcessId == processId &&
                r.AgeCategoryId == ageCategoryId &&
                r.StateId == stateId)
            .Include(r => r.Document)
            .ToListAsync();

        // 2️⃣ Fetch All-India rules
        var allIndia = await _db.Requirements
            .Where(r =>
                r.ProcessId == processId &&
                r.AgeCategoryId == ageCategoryId &&
                r.StateId == null)
            .Include(r => r.Document)
            .ToListAsync();

        // 3️⃣ Merge logic (state overrides all-india)
        var finalMap = allIndia
            .ToDictionary(x => x.DocumentId, x => x);

        foreach (var r in stateSpecific)
            finalMap[r.DocumentId] = r;

        // 4️⃣ Order + project
        var documents = finalMap.Values
            .OrderBy(x => x.SortOrder)
            .Select(x => new SearchResultItemDto(
                x.DocumentId,
                x.Document.Name,
                x.SortOrder,
                x.StepDescription))
            .ToList();

        return Ok(new SearchResultDto(
            processId,
            ageCategoryId,
            stateId,
            documents));
    }
}
