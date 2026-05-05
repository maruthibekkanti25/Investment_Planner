using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
 
namespace dotnetapp.Services
{
    public class FeedbackService
    {
        public ApplicationDbContext db;
        public FeedbackService(ApplicationDbContext con)
        {
            db = con;
        }
        public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
        {
            return await db.Feedbacks
                           .Include(f => f.User)
                           .ToListAsync();
        }
 
        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
        {
            return await db.Feedbacks.Where(r => r.UserId == userId).ToListAsync();
 
        }
 
        public async Task<bool> AddFeedback(Feedback feedback)
        {
            db.Feedbacks.Add(feedback);
            await db.SaveChangesAsync();
            return true;
 
        }
 
        public async Task<bool> DeleteFeedback(int feedbackId)
        {
            var feedback = await db.Feedbacks.FirstOrDefaultAsync(res => res.FeedbackId == feedbackId);
            if (feedback == null)
            {
                return false;
            }
            db.Feedbacks.Remove(feedback);
            await db.SaveChangesAsync();
            return true;
 
        }
    }
}