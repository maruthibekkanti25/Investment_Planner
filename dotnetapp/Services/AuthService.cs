using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
 
namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly RSAKeyService _rsaService;
 
        public AuthService(ApplicationDbContext db, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, RSAKeyService rsaService)
        {
            _db = db;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _passwordHasher = new PasswordHasher<User>();
            _rsaService = rsaService;
        }
 
        // Registration with RSA Decryption
        public async Task<(int, string)> Registration(User model, string role)
        {
            // Decrypt sensitive fields
            string decryptedEmail = _rsaService.Decrypt(model.Email);
            string decryptedPassword = _rsaService.Decrypt(model.Password);
           
 
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == decryptedEmail);
            if (existingUser != null)
            {
                return (0, "User already exists");
            }
 
            if (role == "Admin")
            {
                var configuredKey = _configuration["AdminSecretKey"];
                if (string.IsNullOrEmpty(configuredKey))
                {
                    return (0, "Admin secret key is not configured");
                }
 
                var httpContext = _httpContextAccessor.HttpContext;
                var providedKey = httpContext?.Request.Headers["X-Admin-Key"].FirstOrDefault();
 
                if (providedKey != configuredKey)
                {
                    return (0, "Unauthorized: Only owner can create Admin account");
                }
            }
 
            model.Email = decryptedEmail;
            model.Password = _passwordHasher.HashPassword(model, decryptedPassword);
            model.UserRole = role;
 
            _db.Users.Add(model);
            await _db.SaveChangesAsync();
 
            return (1, "User registered successfully");
        }
 
        // Login with RSA Decryption
        public async Task<(int, string, User?)> Login(LoginModel model)
        {
            string decryptedEmail = _rsaService.Decrypt(model.Email);
            string decryptedPassword = _rsaService.Decrypt(model.Password);
 
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == decryptedEmail);
            if (user == null)
            {
                return (0, "Invalid email", null);
            }
 
            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            {
                return (0, $"Account is locked until {user.LockoutEnd.Value.ToLocalTime():f}", null);
            }
 
            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, decryptedPassword);
            if (result == PasswordVerificationResult.Failed)
            {
                user.FailedLoginAttempts++;
 
                if (user.FailedLoginAttempts >= 5)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(1);
                    await _db.SaveChangesAsync();
                    return (0, "Account locked due to multiple failed attempts. Try again in 1 minute.", null);
                }
 
                await _db.SaveChangesAsync();
                return (0, "Invalid password", null);
            }
 
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            await _db.SaveChangesAsync();
 
            var ipAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();
            Console.WriteLine($"Login successful for {user.Email} from IP: {ipAddress}");
 
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim("userId", user.UserId.ToString()),
                new Claim("username", user.Username ?? string.Empty)
            };
 
            var token = GenerateToken(claims);
            return (1, token, user);
        }
        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var secretKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(secretKey))
                throw new InvalidOperationException("JWT Key is not configured in appsettings.json");
 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
 
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials
            );
 
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}