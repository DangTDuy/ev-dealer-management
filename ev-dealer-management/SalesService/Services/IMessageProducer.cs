namespace SalesService.Services
{
    public interface IMessageProducer
    {
        void PublishMessage<T>(T message, string queueName);
    }
}
