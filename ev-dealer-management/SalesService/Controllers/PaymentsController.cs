using Microsoft.AspNetCore.Mvc;
using SalesService.Data;
using SalesService.DTOs;
using SalesService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public PaymentsController(SalesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
        {
            var payments = await _context.Payments
                .Select(p => new PaymentDto
                {
                    Id = p.PaymentId,
                    OrderId = p.OrderId,
                    Amount = p.Amount,
                    PaymentDate = p.PaidDate ?? DateTime.MinValue,
                    PaymentMethod = p.Method,
                    Status = p.Status,
                    TransactionId = p.TransactionCode,
                    Notes = p.Notes,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();
            return Ok(payments);
        }

        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreatePayment(CreatePaymentDto createDto)
        {
            var payment = new Payment
            {
                PaymentId = Guid.NewGuid(),
                OrderId = createDto.OrderId,
                Amount = createDto.Amount,
                Method = createDto.PaymentMethod,
                Status = createDto.Status,
                TransactionCode = createDto.TransactionId,
                PaidDate = createDto.PaymentDate,
                Notes = createDto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var paymentDto = new PaymentDto { /* map properties */ };
            return CreatedAtAction(nameof(GetPayments), new { id = payment.PaymentId }, paymentDto);
        }
    }
}
