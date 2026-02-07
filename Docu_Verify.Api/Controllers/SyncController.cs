using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers;

[ApiController]
[Route("api/sync")]
public class SyncController : ControllerBase
{
    private readonly AppDbContext _db;
    public SyncController(AppDbContext db) => _db = db;

    // GET /api/sync?lastSync=2026-02-06T07:00:00Z
    [HttpGet]
    public async Task<ActionResult<SyncResponseDto>> Sync(
        [FromQuery] DateTime? lastSync)
    {
        // If first sync, return everything
        var syncTime = lastSync ?? DateTime.MinValue;

        var states = await _db.States
            .IgnoreQueryFilters()
            .Where(x => x.UpdatedAt > syncTime)
            .ToListAsync();

        var ageCategories = await _db.AgeCategories
            .IgnoreQueryFilters()
            .Where(x => x.UpdatedAt > syncTime)
            .ToListAsync();

        var processes = await _db.Processes
            .IgnoreQueryFilters()
            .Where(x => x.UpdatedAt > syncTime)
            .ToListAsync();

        var documents = await _db.Documents
            .IgnoreQueryFilters()
            .Where(x => x.UpdatedAt > syncTime)
            .ToListAsync();

        var requirements = await _db.Requirements
            .IgnoreQueryFilters()
            .Where(x => x.UpdatedAt > syncTime)
            .ToListAsync();

        return Ok(new SyncResponseDto(
            ServerTime: DateTime.UtcNow,
            States: states,
            AgeCategories: ageCategories,
            Processes: processes,
            Documents: documents,
            Requirements: requirements
        ));
    }
}
