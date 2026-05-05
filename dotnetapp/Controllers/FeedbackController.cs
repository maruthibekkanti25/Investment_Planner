using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
 
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        public FeedbackService ser;
        public FeedbackController(FeedbackService service)
        {
            ser = service;
 
        }
 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await ser.GetAllFeedbacks();
                return Ok(feedbacks);
 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
 
 
        }
 
 
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetFeedbacksByUserId(int userId)
        {
            try
            {
                var feedbacks = await ser.GetFeedbacksByUserId(userId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
 
        }
        [HttpPost]
        public async Task<IActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            if (feedback == null)
                return BadRequest("Feedback data is required.");
 
            if (feedback.UserId <= 0)
                return BadRequest("Valid UserId is required.");
 
           
            feedback.User = null;
 
            try
            {
                await ser.AddFeedback(feedback);
                return Ok(new { message = "Feedback added successfully", feedbackId = feedback.FeedbackId });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, $"Database Error: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
 
 
        [HttpDelete("{feedbackId}")]
        public async Task<IActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                var deleted = await ser.DeleteFeedback(feedbackId);
                if (!deleted)
                {
                    return NotFound("Cannot find any feedback");
                }
                return Ok("Feedback deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
 
    }
}