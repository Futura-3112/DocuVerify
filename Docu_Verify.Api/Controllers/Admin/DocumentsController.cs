using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Docu_Verify.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/documents")]
public class DocumentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public DocumentsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<DocumentDto>>> GetAll()
    {
        var items = await _db.Documents
            .OrderBy(x => x.Name)
            .Select(x => new DocumentDto(x.Id, x.Name, x.Notes, x.UpdatedAt))
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> Create(DocumentCreateDto dto)
    {
        var entity = new Document { Name = dto.Name.Trim(), Notes = dto.Notes };
        _db.Documents.Add(entity);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll),
            new DocumentDto(entity.Id, entity.Name, entity.Notes, entity.UpdatedAt));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, DocumentUpdateDto dto)
    {
        var entity = await _db.Documents.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Name = dto.Name.Trim();
        entity.Notes = dto.Notes;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDelete(Guid id)
    {
        var entity = await _db.Documents.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.IsDeleted = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
