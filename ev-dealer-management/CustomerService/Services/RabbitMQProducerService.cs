using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace CustomerService.Services
{
    public class RabbitMQProducerService : IMessageProducer
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RabbitMQProducerService> _logger;
        private IConnection _connection;
        private IModel _channel;

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

                _channel.ExchangeDeclare(exchange: "customer_exchange", type: ExchangeType.Fanout);

                _logger.LogInformation("RabbitMQ connection and channel initialized successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not connect to RabbitMQ. Check connection settings.");
                // Optionally, implement a retry mechanism here
            }
        }

        public void PublishMessage<T>(T message, string routingKey = "")
        {
            if (_channel == null || !_channel.IsOpen)
            {
                _logger.LogWarning("RabbitMQ channel is not open. Attempting to re-initialize.");
                InitializeRabbitMQ(); // Attempt to re-initialize
                if (_channel == null || !_channel.IsOpen)
                {
                    _logger.LogError("Failed to publish message: RabbitMQ channel is still not open.");
                    return;
                }
            }

            var json = JsonSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(json);

            try
            {
                _channel.BasicPublish(exchange: "customer_exchange",
                                     routingKey: routingKey,
                                     basicProperties: null,
                                     body: body);
                _logger.LogInformation("Message published to RabbitMQ: {MessageType}", typeof(T).Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing message to RabbitMQ.");
            }
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
        }
    }

    public interface IMessageProducer
    {
        void PublishMessage<T>(T message, string routingKey = "");
    }
}
