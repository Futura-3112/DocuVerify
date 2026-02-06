using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Docu_Verify.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/age-categories")]
public class AgeCategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AgeCategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<AgeCategoryDto>>> GetAll()
    {
        var items = await _db.AgeCategories
            .OrderBy(x => x.MinAge)
            .Select(x => new AgeCategoryDto(x.Id, x.Name, x.MinAge, x.MaxAge, x.UpdatedAt))
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<AgeCategoryDto>> Create(AgeCategoryCreateDto dto)
    {
        var entity = new AgeCategory
        {
            Name = dto.Name.Trim(),
            MinAge = dto.MinAge,
            MaxAge = dto.MaxAge
        };

        _db.AgeCategories.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll),
            new AgeCategoryDto(entity.Id, entity.Name, entity.MinAge, entity.MaxAge, entity.UpdatedAt));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, AgeCategoryUpdateDto dto)
    {
        var entity = await _db.AgeCategories.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Name = dto.Name.Trim();
        entity.MinAge = dto.MinAge;
        entity.MaxAge = dto.MaxAge;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDelete(Guid id)
    {
        var entity = await _db.AgeCategories.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.IsDeleted = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
