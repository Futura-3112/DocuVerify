using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Docu_Verify.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/processes")]
public class ProcessesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProcessesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ProcessDto>>> GetAll()
    {
        var items = await _db.Processes
            .OrderBy(x => x.Name)
            .Select(x => new ProcessDto(x.Id, x.Name, x.Description, x.UpdatedAt))
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<ProcessDto>> Create(ProcessCreateDto dto)
    {
        var entity = new Process { Name = dto.Name.Trim(), Description = dto.Description };
        _db.Processes.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll),
            new ProcessDto(entity.Id, entity.Name, entity.Description, entity.UpdatedAt));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, ProcessUpdateDto dto)
    {
        var entity = await _db.Processes.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Name = dto.Name.Trim();
        entity.Description = dto.Description;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDelete(Guid id)
    {
        var entity = await _db.Processes.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.IsDeleted = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
