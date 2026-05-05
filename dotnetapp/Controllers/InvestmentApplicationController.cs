using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestmentApplicationController : ControllerBase
    {
        private readonly InvestmentApplicationService _investmentApplicationService;

        public InvestmentApplicationController(InvestmentApplicationService investmentApplicationService)
        {
            _investmentApplicationService = investmentApplicationService;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvestmentApplication>>> GetAllInvestmentApplications()
        {
            try
            {
                var applications = await _investmentApplicationService.GetAllInvestmentApplications();
                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<InvestmentApplication>>> GetInvestmentApplicationByUserId(int userId)
        {
            try
            {
                var applications = await _investmentApplicationService.GetInvestmentApplicationsByUserId(userId);
                if (applications == null || !applications.Any())
                {
                    return NotFound("Cannot find any investment application");
                }
                return Ok(applications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<ActionResult> AddInvestmentApplication([FromBody] InvestmentApplication investmentApplication)
        {
            try
            {
                var result = await _investmentApplicationService.AddInvestmentApplication(investmentApplication);
                return result ? Ok("Investment application added successfully") : BadRequest("Failed to add investment application");
            }
            catch (InvestmentException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut("{investmentApplicationId}")]
        public async Task<ActionResult> UpdateInvestmentApplication(int investmentApplicationId, [FromBody] InvestmentApplication investmentApplication)
        {
            try
            {
                var result = await _investmentApplicationService.UpdateInvestmentApplication(investmentApplicationId, investmentApplication);
                return result ? Ok("Investment application updated successfully") : NotFound("Cannot find any investment application");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        
        [HttpDelete("{investmentApplicationId}")]
        public async Task<ActionResult> DeleteInvestmentApplication(int investmentApplicationId)
        {
            try
            {
                var result = await _investmentApplicationService.DeleteInvestmentApplication(investmentApplicationId);
                return result ? Ok("Investment application deleted successfully") : NotFound("Cannot find any investment application");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    
}
}