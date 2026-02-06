using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Docu_Verify.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/states")]
public class StatesController : ControllerBase
{
    private readonly AppDbContext _db;
    public StatesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<StateDto>>> GetAll()
    {
        var items = await _db.States
            .OrderBy(x => x.Name)
            .Select(x => new StateDto(x.Id, x.Name, x.UpdatedAt))
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<StateDto>> Create(StateCreateDto dto)
    {
        var entity = new State { Name = dto.Name.Trim() };
        _db.States.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll),
            new StateDto(entity.Id, entity.Name, entity.UpdatedAt));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, StateUpdateDto dto)
    {
        var entity = await _db.States.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Name = dto.Name.Trim();
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDelete(Guid id)
    {
        var entity = await _db.States.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.IsDeleted = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
