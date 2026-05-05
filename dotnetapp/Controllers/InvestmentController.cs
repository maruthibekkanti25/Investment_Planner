using System;
using System.Buffers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Exceptions;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
 
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/investment")]
    public class InvestmentController : ControllerBase
    {
        public InvestmentService _investmentService;
        public InvestmentController(InvestmentService service)
        {
            _investmentService = service;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Investment>>> GetAllInvestments()
        {
            IEnumerable<Investment> investments = null;
            try
            {
                investments = await _investmentService.GetAllInvestments();
            }
            catch (InvestmentException e)
            {
                Console.WriteLine(e.Message);
            }
            return Ok(investments);
        }
        [HttpGet("{investmentId}")]
 
        public async Task<ActionResult<Investment>> GetInvestmentById(int investmentId)
        {
            Investment investment = null;
            try
            {
                investment = await _investmentService.GetInvestmentById(investmentId);
                if (investment == null)
                {
                    return StatusCode(404, "Cannot find any investment");
                }
            }
            catch (InvestmentException e)
            {
                Console.WriteLine(e.Message);
            }
            return Ok(investment);
        }
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddInvestment([FromBody] Investment investment)
        {
            try
            {
                var added = await _investmentService.AddInvestment(investment);
                if (added)
                {
                    return Ok("Investment added successfully");
                }
                else
                {
                    return StatusCode(500, "Failed to add Investment");
                }
            }
            catch (InvestmentException e)
            {
                return StatusCode(500, $"Internal Server Error: {e.Message}");
            }
        }
        [HttpPut("{investmentId}")]
        public async Task<ActionResult> UpdateInvestment(int investmentId, [FromBody] Investment investment)
        {
            try
            {
                var updated = await _investmentService.UpdateInvestment(investmentId, investment);
                if (updated)
                {
                    return Ok(new { message = "Investment updated successfully" });
                }
                else
                {
                    return NotFound(new { message = "Cannot find any Investment" });
                }
            }
            catch (InvestmentException e)
            {
                return StatusCode(500, new { message = $"Internal Server Error: {e.Message}" });
            }
        }
       
        [HttpDelete("{InvestmentId}")]
        public async Task<ActionResult> DeleteInvestment(int InvestmentId)
        {
            try
            {
                var investment = await _investmentService.DeleteInvestment(InvestmentId);
                if (investment)
                {
                    return StatusCode(200, "Investment deleted successfully");
                }
                else
                {
                    return StatusCode(404, "Cannot find any Investment");
                }
            }
            catch (InvestmentException e)
            {
                return StatusCode(500, $"Internal Server Error: {e.Message}");
            }
        }
 
 
    }
}