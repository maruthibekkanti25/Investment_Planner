using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using log4net;
using System.Reflection;
 
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly RSAKeyService _rsaService;
        private static readonly ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod()?.DeclaringType);
 
        public AuthenticationController(IAuthService authService, RSAKeyService rsaService)
        {
            _authService = authService;
            _rsaService = rsaService;
        }
 
        // Public Key Endpoint
        [HttpGet("public-key")]
        public IActionResult GetPublicKey()
        {
            return Ok(_rsaService.GetPublicKey());
        }
 
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            log.Info($"Login attempt initiated for user: {model.Email}");
 
            try
            {
                var (status, token, user) = await _authService.Login(model);
 
                if (status == 0 || user == null)
                {
                    log.Warn($"Login failed for user: {model.Email}. Reason: {token}");
                    return BadRequest(new { Message = token });
                }
 
                log.Info($"Login successful for user: {model.Email}");
 
                return Ok(new
                {
                    token,
                    User = new
                    {
                        UserId = user.UserId,
                        Email = user.Email,
                        Username = user.Username,
                        MobileNumber = user.MobileNumber,
                        UserRole = user.UserRole
                    }
                });
            }
            catch (Exception ex)
            {
                log.Error($"Unexpected error during login for user: {model.Email}", ex);
                return StatusCode(500, new { Message = "An unexpected error occurred. Please try again later." });
            }
        }
 
        [HttpPost("register")]
        public async Task<IActionResult> Register(User model)
        {
            log.Info($"Registration attempt initiated for user: {model.Email}");
 
            try
            {
                if (!ModelState.IsValid)
                {
                    log.Warn($"Registration failed due to invalid model state for user: {model.Email}");
                    return BadRequest(ModelState);
                }
 
                var result = await _authService.Registration(model, model.UserRole);
 
                if (result.Item1 != 1)
                {
                    log.Warn($"Registration failed for user: {model.Email}. Reason: {result.Item2}");
 
                    if (result.Item2.Contains("Unauthorized"))
                    {
                        return StatusCode(403, new { Message = result.Item2 });
                    }
 
                    return StatusCode(400, new { Message = result.Item2 });
                }
 
                log.Info($"Registration successful for user: {model.Email}");
                return Ok(new { Message = result.Item2 });
            }
            catch (Exception ex)
            {
                log.Error($"Unexpected error during registration for user: {model.Email}", ex);
                return StatusCode(500, new { Message = "An unexpected error occurred. Please try again later." });
            }
        }
    }
}