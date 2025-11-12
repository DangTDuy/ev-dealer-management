using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using NotificationService.DTOs; // Assuming DTOs folder exists or will be created

namespace NotificationService.Services
{
    public class RabbitMQConsumerService : IMessageConsumer, IDisposable
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RabbitMQConsumerService> _logger;
        private IConnection? _connection;
        private IModel? _channel;
        private readonly string _queueName = "customer_created_queue"; // Specific queue for customer created events

        public RabbitMQConsumerService(IConfiguration configuration, ILogger<RabbitMQConsumerService> logger)
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
                _channel.QueueDeclare(queue: _queueName,
                                     durable: true,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);
                _channel.QueueBind(queue: _queueName,
                                  exchange: "customer_exchange",
                                  routingKey: ""); // Fanout exchange ignores routing key

                _logger.LogInformation("RabbitMQ consumer connection and channel initialized successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not connect to RabbitMQ for consuming. Check connection settings.");
            }
        }

        public void StartConsuming()
        {
            if (_channel == null || !_channel.IsOpen)
            {
                _logger.LogWarning("RabbitMQ channel is not open. Attempting to re-initialize for consuming.");
                InitializeRabbitMQ();
                if (_channel == null || !_channel.IsOpen)
                {
                    _logger.LogError("Failed to start consuming: RabbitMQ channel is still not open.");
                    return;
                }
            }

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                _logger.LogInformation("Received message: {Message}", message);

                try
                {
                    var customerCreatedEvent = JsonSerializer.Deserialize<CustomerCreatedEvent>(message);
                    if (customerCreatedEvent != null)
                    {
                        _logger.LogInformation("Processing CustomerCreatedEvent for CustomerId: {CustomerId}, Name: {Name}",
                            customerCreatedEvent.CustomerId, customerCreatedEvent.Name);
                        // Here you would add logic to handle the event, e.g., send a notification
                    }
                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Error deserializing message: {Message}", message);
                    _channel.BasicNack(ea.DeliveryTag, false, false); // Nack the message, don't re-queue
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message: {Message}", message);
                    _channel.BasicNack(ea.DeliveryTag, false, true); // Nack and re-queue for retry
                }
            };

            _channel.BasicConsume(queue: _queueName,
                                 autoAck: false, // We'll manually acknowledge
                                 consumer: consumer);
            _logger.LogInformation("Started consuming messages from queue: {QueueName}", _queueName);
        }

        public void StopConsuming()
        {
            _logger.LogInformation("Stopping RabbitMQ consumer.");
            Dispose();
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            _logger.LogInformation("RabbitMQ consumer connection closed.");
        }
    }
}
