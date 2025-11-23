using SendGrid;
using SendGrid.Helpers.Mail;
using Serilog;

namespace NotificationService.Services;

public class EmailService : IEmailService
{
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public EmailService(IConfiguration configuration)
    {
        _apiKey = configuration["SendGrid:ApiKey"] ?? throw new ArgumentNullException("SendGrid:ApiKey not configured");
        _fromEmail = configuration["SendGrid:FromEmail"] ?? throw new ArgumentNullException("SendGrid:FromEmail not configured");
        _fromName = configuration["SendGrid:FromName"] ?? "EV Dealer Management";
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string htmlContent, string? plainTextContent = null)
    {
        try
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress(_fromEmail, _fromName);
            var toAddress = new EmailAddress(to);
            var msg = MailHelper.CreateSingleEmail(from, toAddress, subject, plainTextContent ?? htmlContent, htmlContent);

            var response = await client.SendEmailAsync(msg);

            if (response.IsSuccessStatusCode)
            {
                Log.Information("Email sent successfully to {Email}. Subject: {Subject}", to, subject);
                return true;
            }
            else
            {
                var body = await response.Body.ReadAsStringAsync();
                Log.Error("Failed to send email to {Email}. Status: {Status}. Response: {Response}", to, response.StatusCode, body);
                return false;
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Exception occurred while sending email to {Email}", to);
            return false;
        }
    }

    public async Task<bool> SendOrderConfirmationAsync(string customerEmail, string customerName, string vehicleModel, decimal totalPrice, string orderId)
    {
        var subject = "Order Confirmation - EV Dealer Management";
        var htmlContent = $@"
            <html>
            <body>
                <h2>Thank you for your purchase, {customerName}!</h2>
                <p>Your order has been confirmed.</p>
                <h3>Order Details:</h3>
                <ul>
                    <li><strong>Order ID:</strong> {orderId}</li>
                    <li><strong>Vehicle Model:</strong> {vehicleModel}</li>
                    <li><strong>Total Price:</strong> ${totalPrice:N2}</li>
                </ul>
                <p>We will contact you shortly to arrange the delivery.</p>
                <p>Best regards,<br/>EV Dealer Management Team</p>
            </body>
            </html>
        ";

        var plainTextContent = $"Thank you for your purchase, {customerName}!\n\n" +
                              $"Order ID: {orderId}\n" +
                              $"Vehicle Model: {vehicleModel}\n" +
                              $"Total Price: ${totalPrice:N2}\n\n" +
                              $"We will contact you shortly to arrange the delivery.";

        return await SendEmailAsync(customerEmail, subject, htmlContent, plainTextContent);
    }

    public async Task<bool> SendTestDriveConfirmationAsync(string customerEmail, string customerName, string vehicleModel, DateTime scheduledDate)
    {
        var subject = "Test Drive Confirmation - EV Dealer Management";
        var htmlContent = $@"
            <html>
            <body>
                <h2>Hello {customerName},</h2>
                <p>Your test drive appointment has been confirmed!</p>
                <h3>Appointment Details:</h3>
                <ul>
                    <li><strong>Vehicle Model:</strong> {vehicleModel}</li>
                    <li><strong>Date & Time:</strong> {scheduledDate:dddd, MMMM dd, yyyy 'at' hh:mm tt}</li>
                </ul>
                <p>Please arrive 10 minutes before your scheduled time.</p>
                <p>Looking forward to seeing you!<br/>EV Dealer Management Team</p>
            </body>
            </html>
        ";

        var plainTextContent = $"Hello {customerName},\n\n" +
                              $"Your test drive appointment has been confirmed!\n" +
                              $"Vehicle Model: {vehicleModel}\n" +
                              $"Date & Time: {scheduledDate:dddd, MMMM dd, yyyy 'at' hh:mm tt}\n\n" +
                              $"Please arrive 10 minutes before your scheduled time.";

        return await SendEmailAsync(customerEmail, subject, htmlContent, plainTextContent);
    }
}
