using Microsoft.AspNetCore.Mvc;
using NotificationService.Services;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public NotificationController(IEmailService emailService, ISmsService smsService)
    {
        _emailService = emailService;
        _smsService = smsService;
    }

    [HttpPost("test-email")]
    public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
    {
        var success = await _emailService.SendEmailAsync(
            request.To,
            request.Subject,
            request.HtmlContent
        );

        return success 
            ? Ok(new { message = "Email sent successfully" })
            : BadRequest(new { message = "Failed to send email" });
    }

    [HttpPost("test-sms")]
    public async Task<IActionResult> TestSms([FromBody] TestSmsRequest request)
    {
        var success = await _smsService.SendSmsAsync(
            request.PhoneNumber,
            request.Message
        );

        return success 
            ? Ok(new { message = "SMS sent successfully" })
            : BadRequest(new { message = "Failed to send SMS" });
    }

    [HttpPost("order-confirmation")]
    public async Task<IActionResult> SendOrderConfirmation([FromBody] OrderConfirmationRequest request)
    {
        var success = await _emailService.SendOrderConfirmationAsync(
            request.CustomerEmail,
            request.CustomerName,
            request.VehicleModel,
            request.TotalPrice,
            request.OrderId
        );

        return success 
            ? Ok(new { message = "Order confirmation email sent successfully" })
            : BadRequest(new { message = "Failed to send order confirmation email" });
    }

    [HttpPost("reservation-confirmation")]
    public async Task<IActionResult> SendReservationConfirmation([FromBody] ReservationConfirmationRequest request)
    {
        var success = await _smsService.SendReservationConfirmationAsync(
            request.CustomerPhone,
            request.CustomerName,
            request.VehicleModel,
            request.ColorName
        );

        return success 
            ? Ok(new { message = "Reservation confirmation SMS sent successfully" })
            : BadRequest(new { message = "Failed to send reservation confirmation SMS" });
    }

    [HttpPost("test-drive-confirmation")]
    public async Task<IActionResult> SendTestDriveConfirmation([FromBody] TestDriveConfirmationRequest request)
    {
        var success = await _emailService.SendTestDriveConfirmationAsync(
            request.CustomerEmail,
            request.CustomerName,
            request.VehicleModel,
            request.ScheduledDate
        );

        return success 
            ? Ok(new { message = "Test drive confirmation email sent successfully" })
            : BadRequest(new { message = "Failed to send test drive confirmation email" });
    }
}

public record TestEmailRequest(string To, string Subject, string HtmlContent);
public record TestSmsRequest(string PhoneNumber, string Message);
public record OrderConfirmationRequest(string CustomerEmail, string CustomerName, string VehicleModel, decimal TotalPrice, string OrderId);
public record ReservationConfirmationRequest(string CustomerPhone, string CustomerName, string VehicleModel, string ColorName);
public record TestDriveConfirmationRequest(string CustomerEmail, string CustomerName, string VehicleModel, DateTime ScheduledDate);
