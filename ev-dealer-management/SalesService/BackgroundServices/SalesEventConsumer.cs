using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace SalesService.BackgroundServices
{
    public class SalesEventConsumer : BackgroundService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private const string ExchangeName = "reservation_events";
        private const string QueueName = "sales_display_queue";
        private const string BindingKey = "reservation.processed";

        public SalesEventConsumer()
        {
            var factory = new ConnectionFactory { HostName = "localhost" };
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.ExchangeDeclare(exchange: ExchangeName, type: ExchangeType.Topic, durable: true);
            _channel.QueueDeclare(queue: QueueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queue: QueueName, exchange: ExchangeName, routingKey: BindingKey);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (ch, ea) =>
            {
                var content = Encoding.UTF8.GetString(ea.Body.ToArray());
                Console.WriteLine($"📩 Sales Service: Received event [{BindingKey}]: {content}");
                Console.WriteLine("📈 Sales Service: Updating dashboard...");

                _channel.BasicAck(ea.DeliveryTag, multiple: false);
            };

            _channel.BasicConsume(queue: QueueName, autoAck: false, consumer: consumer);

            return Task.CompletedTask;
        }

        public override void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            base.Dispose();
        }
    }
}

