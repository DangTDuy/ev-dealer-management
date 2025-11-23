using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace SalesService.Messaging
{
    public class RabbitMQProducer : IMessageProducer
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RabbitMQProducer> _logger;
        private IConnection? _connection;
        private IModel? _channel;

        public RabbitMQProducer(IConfiguration configuration, ILogger<RabbitMQProducer> logger)
        {
            _configuration = configuration;
            _logger = logger;
            InitializeRabbitMQ();
        }

        private void InitializeRabbitMQ()
        {
            try
            {
                var factory = new ConnectionFactory
                {
                    HostName = _configuration["RabbitMQ:HostName"],
                    Port = int.Parse(_configuration["RabbitMQ:Port"] ?? "5672"),
                    UserName = _configuration["RabbitMQ:UserName"],
                    Password = _configuration["RabbitMQ:Password"]
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                _channel.ExchangeDeclare(exchange: "sales_exchange", type: ExchangeType.Topic);
                _logger.LogInformation("Connected to RabbitMQ and declared exchange 'sales_exchange'.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not connect to RabbitMQ or declare exchange.");
            }
        }

        public void SendMessage<T>(T message, string routingKey)
        {
            if (_channel == null || !_channel.IsOpen)
            {
                _logger.LogWarning("RabbitMQ channel is not open. Attempting to re-initialize.");
                InitializeRabbitMQ(); // Attempt to re-initialize connection
                if (_channel == null || !_channel.IsOpen)
                {
                    _logger.LogError("Failed to send message: RabbitMQ channel is still not open.");
                    return;
                }
            }

            try
            {
                var json = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(json);

                _channel.BasicPublish(
                    exchange: "sales_exchange", // Use a specific exchange for sales events
                    routingKey: routingKey,
                    basicProperties: null,
                    body: body);

                _logger.LogInformation("Message sent to RabbitMQ with routing key '{RoutingKey}': {Message}", routingKey, json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message to RabbitMQ with routing key '{RoutingKey}'.", routingKey);
            }
        }

        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}
