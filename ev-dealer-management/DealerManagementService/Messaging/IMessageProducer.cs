namespace DealerManagementService.Messaging
{
    public interface IMessageProducer
    {
        void SendMessage<T>(T message, string routingKey);
    }
}

