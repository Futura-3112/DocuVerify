using Docu_Verify.Api.Data;
using Docu_Verify.Api.Dtos;
using Docu_Verify.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Docu_Verify.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppDbContext db, ILogger<AuthController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpPost("sync-user")]
    public async Task<ActionResult<UserDto>> SyncUser([FromBody] UserSyncRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FirebaseUid))
            return BadRequest("Firebase UID is required.");

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.FirebaseUid == request.FirebaseUid);

        if (user == null)
        {
            var userCount = await _db.Users.CountAsync();
            var role = userCount == 0 ? "Admin" : "User";

            // Register new user
            user = new User
            {
                FirebaseUid = request.FirebaseUid,
                Email = request.Email,
                DisplayName = request.DisplayName,
                IsAnonymous = request.IsAnonymous,
                LastLoginAt = DateTime.UtcNow,
                Role = role
            };

            _db.Users.Add(user);
        }
        else
        {
            // Update existing user info on login
            user.LastLoginAt = DateTime.UtcNow;
            if (!string.IsNullOrEmpty(request.Email)) user.Email = request.Email;
            if (!string.IsNullOrEmpty(request.DisplayName)) user.DisplayName = request.DisplayName;
            user.IsAnonymous = request.IsAnonymous;
        }

        await _db.SaveChangesAsync();

        return Ok(new UserDto(
            user.Id,
            user.FirebaseUid,
            user.Email,
            user.Role,
            user.UpdatedAt // BaseEntity has UpdatedAt
        ));
    }
}
