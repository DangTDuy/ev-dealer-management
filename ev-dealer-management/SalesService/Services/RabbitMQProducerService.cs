using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace SalesService.Services
{
    public class RabbitMQProducerService : IMessageProducer, IDisposable
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly ILogger<RabbitMQProducerService> _logger;

        public RabbitMQProducerService(IConfiguration configuration, ILogger<RabbitMQProducerService> logger)
        {
            _logger = logger;

            var rabbitMQHost = configuration["RabbitMQ:Host"] ?? "localhost";
            var rabbitMQPort = configuration.GetValue<int>("RabbitMQ:Port", 5672);

            var factory = new ConnectionFactory
            {
                HostName = rabbitMQHost,
                Port = rabbitMQPort,
                DispatchConsumersAsync = true
            };

            try
            {
                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();
                _logger.LogInformation("RabbitMQ Producer connected to {Host}:{Port}", rabbitMQHost, rabbitMQPort);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to RabbitMQ at {Host}:{Port}", rabbitMQHost, rabbitMQPort);
                throw;
            }
        }

        public void PublishMessage<T>(T message, string queueName)
        {
            try
            {
                // Declare queue before publishing (ensure it exists)
                _channel.QueueDeclare(
                    queue: queueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null
                );

                var jsonMessage = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(jsonMessage);

                var properties = _channel.CreateBasicProperties();
                properties.Persistent = true;

                // Publish to queue directly using default exchange ("")
                _channel.BasicPublish(
                    exchange: "",
                    routingKey: queueName,
                    basicProperties: properties,
                    body: body
                );

                _logger.LogInformation("Published message to queue {QueueName}: {Message}", queueName, jsonMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish message to queue {QueueName}", queueName);
                throw;
            }
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            _logger.LogInformation("RabbitMQ Producer connection closed");
        }
    }
}
