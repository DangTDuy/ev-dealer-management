using Microsoft.AspNetCore.Mvc;
using VehicleService.Messaging;
using VehicleService.Models;

namespace VehicleService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IMessageProducer _messageProducer;

        public ReservationsController(IMessageProducer messageProducer)
        {
            _messageProducer = messageProducer;
        }

        [HttpPost]
        public IActionResult CreateReservation([FromBody] ReservationEventDto reservation)
        {
            if (reservation == null)
            {
                return BadRequest("Reservation payload is required.");
            }

            // TODO: Persist reservation data if needed
            Console.WriteLine("✅ Vehicle Service: Reservation saved to database.");

            const string routingKey = "reservation.created";
            _messageProducer.SendMessage(reservation, routingKey);

            return Ok(new
            {
                Message = "Reservation created and event sent.",
                reservation.ReservationId,
                reservation.VehicleId,
                reservation.DealerId
            });
        }
    }
}

