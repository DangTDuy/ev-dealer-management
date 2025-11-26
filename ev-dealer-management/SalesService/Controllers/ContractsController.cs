using Microsoft.AspNetCore.Mvc;
using SalesService.Data;
using SalesService.Models;
using SalesService.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContractsController : ControllerBase
    {
        private readonly SalesDbContext _context;
        private readonly ILogger<ContractsController> _logger;

        public ContractsController(SalesDbContext context, ILogger<ContractsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Creates a new contract from an order.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateContract([FromBody] CreateContractRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Attempting to create contract for Order ID: {OrderId}", request.OrderId);

            var order = await _context.Orders.FindAsync(request.OrderId);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {OrderId} not found.", request.OrderId);
                return NotFound(new { message = $"Order with ID {request.OrderId} not found." });
            }

            var existingContract = await _context.Contracts.FirstOrDefaultAsync(c => c.OrderId == request.OrderId);
            if (existingContract != null)
            {
                _logger.LogWarning("Contract for Order ID {OrderId} already exists.", request.OrderId);
                return BadRequest(new { message = $"A contract for order {request.OrderId} already exists." });
            }

            if (!int.TryParse(request.SalespersonId, out int salespersonId))
            {
                _logger.LogWarning("Invalid SalespersonId format: {SalespersonId}", request.SalespersonId);
                return BadRequest(new { message = "Invalid SalespersonId format." });
            }

            var contract = new Contract
            {
                OrderId = request.OrderId,
                CustomerId = request.CustomerId,
                DealerId = order.DealerId, // Get DealerId from the order
                SalespersonId = salespersonId, // Use the parsed int
                ContractNumber = $"CNTR-{DateTime.UtcNow:yyyyMMdd}-{order.OrderId}", // Generate a contract number
                SignedDate = DateOnly.FromDateTime(request.ContractDate),
                TotalAmount = order.TotalPrice,
                PaymentStatus = request.DepositAmountReceived ? "Partial" : "Unpaid",
                Status = "PendingApproval",
                Notes = request.TermsAndConditions, // Use Notes field to store terms
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            order.Status = "PendingApproval";
            _context.Orders.Update(order);
            _context.Contracts.Add(contract);

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Successfully created contract {ContractId} for Order ID {OrderId}.", contract.ContractId, request.OrderId);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed when creating contract for Order ID {OrderId}.", request.OrderId);
                return StatusCode(500, new { message = "An error occurred while saving the contract.", error = ex.InnerException?.Message ?? ex.Message });
            }

            return CreatedAtAction(nameof(GetContractById), new { id = contract.ContractId }, contract);
        }

        /// <summary>
        /// Gets a contract by its ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContractById(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }
    }
}
