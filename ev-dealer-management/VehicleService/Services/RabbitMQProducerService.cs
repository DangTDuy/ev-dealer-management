using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace VehicleService.Services
{
    public class RabbitMQProducerService : IMessageProducer
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RabbitMQProducerService> _logger;
        private IConnection? _connection;
        private IModel? _channel;

        public RabbitMQProducerService(IConfiguration configuration, ILogger<RabbitMQProducerService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            InitializeRabbitMQ();
        }

        private void InitializeRabbitMQ()
        {
            try
            {
                var factory = new ConnectionFactory()
                {
                    HostName = _configuration["RabbitMQ:HostName"],
                    Port = int.Parse(_configuration["RabbitMQ:Port"] ?? "5672"),
                    UserName = _configuration["RabbitMQ:UserName"],
                    Password = _configuration["RabbitMQ:Password"]
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                // Declare exchange for vehicle events
                _channel.ExchangeDeclare(exchange: "vehicle_events", type: ExchangeType.Topic, durable: true);

                _logger.LogInformation("RabbitMQ producer connection and channel initialized successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not connect to RabbitMQ for publishing. Check connection settings.");
            }
        }

        public void PublishMessage<T>(T message, string routingKey = "")
        {
            if (_channel == null || !_channel.IsOpen)
            {
                _logger.LogWarning("RabbitMQ channel is not open. Attempting to re-initialize for publishing.");
                InitializeRabbitMQ();
                if (_channel == null || !_channel.IsOpen)
                {
                    _logger.LogError("Failed to publish message: RabbitMQ channel is still not open.");
                    return;
                }
            }

            try
            {
                var messageString = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(messageString);

                // Use specific routing key based on message type
                var finalRoutingKey = routingKey;
                if (string.IsNullOrEmpty(routingKey))
                {
                    finalRoutingKey = typeof(T).Name switch
                    {
                        "VehicleCreatedEvent" => "vehicle.created",
                        "VehicleUpdatedEvent" => "vehicle.updated", 
                        "VehicleDeletedEvent" => "vehicle.deleted",
                        "VehicleReservedEvent" => "vehicle.reserved",
                        _ => "vehicle.unknown"
                    };
                }

                _channel.BasicPublish(exchange: "vehicle_events",
                                    routingKey: finalRoutingKey,
                                    basicProperties: null,
                                    body: body);

                _logger.LogInformation("Published message of type {MessageType} to exchange 'vehicle_events' with routing key '{RoutingKey}'", 
                    typeof(T).Name, finalRoutingKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing message of type {MessageType}", typeof(T).Name);
            }
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            _logger.LogInformation("RabbitMQ producer connection closed.");
        }
    }
}
