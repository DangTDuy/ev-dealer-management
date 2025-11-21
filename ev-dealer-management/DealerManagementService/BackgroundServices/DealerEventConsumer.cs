using DealerManagementService.Messaging;
using DealerManagementService.Models;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace DealerManagementService.BackgroundServices
{
    public class DealerEventConsumer : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private const string ExchangeName = "reservation_events";
        private const string QueueName = "dealer_processing_queue";
        private const string BindingKey = "reservation.created";

        public DealerEventConsumer(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;

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
                var reservation = JsonSerializer.Deserialize<ReservationEventDto>(content);

                Console.WriteLine($"📩 Dealer Service: Received event [{BindingKey}] for reservation {reservation?.ReservationId}");

                if (reservation != null)
                {
                    HandleEvent(reservation);
                }

                _channel.BasicAck(ea.DeliveryTag, multiple: false);
            };

            _channel.BasicConsume(queue: QueueName, autoAck: false, consumer: consumer);

            return Task.CompletedTask;
        }

        private void HandleEvent(ReservationEventDto reservation)
        {
            using var scope = _serviceProvider.CreateScope();
            var producer = scope.ServiceProvider.GetRequiredService<IMessageProducer>();
            var db = scope.ServiceProvider.GetRequiredService<Data.DealerDbContext>();

            Console.WriteLine($"⚙️ Dealer Service: Processing reservation ID {reservation.ReservationId}");

            var processedAt = DateTime.UtcNow;
            var entity = new DealerReservation
            {
                ReservationId = reservation.ReservationId,
                VehicleId = reservation.VehicleId,
                DealerId = reservation.DealerId,
                Status = "PROCESSED_BY_DEALER",
                AssignedStaff = "Jane Smith",
                ProcessedAt = processedAt,
                CreatedAt = processedAt
            };

            db.DealerReservations.Add(entity);
            db.SaveChanges();

            var processedEvent = new
            {
                reservation.ReservationId,
                Status = entity.Status,
                ProcessedAt = entity.ProcessedAt,
                AssignedStaff = entity.AssignedStaff,
                DealerReservationId = entity.Id
            };

            const string routingKey = "reservation.processed";
            producer.SendMessage(processedEvent, routingKey);
        }

        public override void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            base.Dispose();
        }
    }
}

