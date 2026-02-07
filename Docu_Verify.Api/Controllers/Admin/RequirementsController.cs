using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Docu_Verify.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/requirements")]
public class RequirementsController : ControllerBase
{
    private readonly AppDbContext _db;
    public RequirementsController(AppDbContext db) => _db = db;

    // GET /api/admin/requirements?processId=...&ageCategoryId=...&stateId=...
    // stateId omitted => All India (null)
    [HttpGet]
    public async Task<ActionResult<List<RequirementDto>>> Get(
        [FromQuery] Guid processId,
        [FromQuery] Guid ageCategoryId,
        [FromQuery] Guid? stateId)
    {
        var list = await _db.Requirements
            .Where(r => r.ProcessId == processId
                     && r.AgeCategoryId == ageCategoryId
                     && r.StateId == stateId)
            .OrderBy(r => r.SortOrder)
            .Select(r => new RequirementDto(
                r.Id, r.ProcessId, r.AgeCategoryId, r.StateId,
                r.DocumentId, r.SortOrder, r.StepDescription, r.UpdatedAt))
            .ToListAsync();

        return Ok(list);
    }

    // PUT /api/admin/requirements
    // Overwrite mapping for (Process, Age, State)
    [HttpPut]
    public async Task<IActionResult> Upsert(RequirementUpsertRequestDto dto)
    {
        dto = dto with { Items = dto.Items ?? new List<RequirementUpsertItemDto>() };

        // Validate master data exists
        if (!await _db.Processes.AnyAsync(p => p.Id == dto.ProcessId))
            return BadRequest("Invalid ProcessId.");

        if (!await _db.AgeCategories.AnyAsync(a => a.Id == dto.AgeCategoryId))
            return BadRequest("Invalid AgeCategoryId.");

        if (dto.StateId.HasValue && !await _db.States.AnyAsync(s => s.Id == dto.StateId.Value))
            return BadRequest("Invalid StateId.");

        // Validate all documents exist
        var docIds = dto.Items.Select(i => i.DocumentId).Distinct().ToList();
        var docCount = await _db.Documents.CountAsync(d => docIds.Contains(d.Id));
        if (docCount != docIds.Count)
            return BadRequest("One or more DocumentId values are invalid.");

        // Pull existing mapping (including deleted) using IgnoreQueryFilters
        var existing = await _db.Requirements
            .IgnoreQueryFilters()
            .Where(r => r.ProcessId == dto.ProcessId
                     && r.AgeCategoryId == dto.AgeCategoryId
                     && r.StateId == dto.StateId)
            .ToListAsync();

        var existingByDocId = existing.ToDictionary(x => x.DocumentId, x => x);

        // Upsert incoming items
        foreach (var item in dto.Items)
        {
            if (existingByDocId.TryGetValue(item.DocumentId, out var row))
            {
                row.IsDeleted = false;
                row.SortOrder = item.SortOrder;
                row.StepDescription = item.StepDescription;
            }
            else
            {
                _db.Requirements.Add(new Requirement
                {
                    ProcessId = dto.ProcessId,
                    AgeCategoryId = dto.AgeCategoryId,
                    StateId = dto.StateId,
                    DocumentId = item.DocumentId,
                    SortOrder = item.SortOrder,
                    StepDescription = item.StepDescription,
                    IsDeleted = false
                });
            }
        }

        // Soft delete removed items
        var incomingSet = dto.Items.Select(i => i.DocumentId).ToHashSet();
        foreach (var row in existing)
        {
            if (!incomingSet.Contains(row.DocumentId))
                row.IsDeleted = true;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
