using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace CustomerService.Services
{
    public class RabbitMQProducerService : IMessageProducer, IDisposable
    {
        private readonly ILogger<RabbitMQProducerService> _logger;
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQProducerService(ILogger<RabbitMQProducerService> logger)
        {
            _logger = logger;

            var factory = new ConnectionFactory
            {
                HostName = "localhost",
                Port = 5672,
                UserName = "guest",
                Password = "guest"
            };

            try
            {
                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                // Declare queues
                _channel.QueueDeclare(
                    queue: "testdrive.scheduled",
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

                _logger.LogInformation("RabbitMQ Producer Service initialized successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to RabbitMQ");
                throw;
            }
        }

        public void PublishMessage<T>(T message, string routingKey = "")
        {
            try
            {
                var jsonMessage = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(jsonMessage);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                _channel.BasicPublish(
                    exchange: "",
                    routingKey: routingKey,
                    basicProperties: properties,
                    body: body);

                _logger.LogInformation($"Published message to queue {routingKey}: {jsonMessage}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish message to queue {routingKey}");
                throw;
            }
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
        }
    }
}
