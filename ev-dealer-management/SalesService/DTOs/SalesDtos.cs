using System.ComponentModel.DataAnnotations;

namespace SalesService.DTOs
{
    // DTOs for Quotes
    public class CreateQuoteDto
    {
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public int VehicleId { get; set; }
        public int? ColorVariantId { get; set; }
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
        public string? Notes { get; set; }

        [Required] // Added SalesRepId
        public int SalesRepId { get; set; }

        // Status field for quote (Finalized, PendingApproval)
        [StringLength(50)]
        public string Status { get; set; } = "Finalized"; // e.g., Finalized, PendingApproval

        // New payment-related fields
        [Required]
        [StringLength(50)]
        public string PaymentType { get; set; } = "Full"; // e.g., Full, Installment

        [Range(0, 100)] // Percentage
        public decimal? DownPaymentPercent { get; set; } // Only for Installment

        [Range(1, 60)] // Months
        public int? LoanTerm { get; set; } // In months, only for Installment

        [Range(0, 100)] // Percentage
        public decimal? InterestRate { get; set; } // Only for Installment
    }

    public class QuoteDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int VehicleId { get; set; }
        public int? ColorVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending"; // e.g., Pending, Accepted, Rejected
        public string? Notes { get; set; }

        public int SalesRepId { get; set; } // Added SalesRepId

        // New payment-related fields
        public string PaymentType { get; set; } = "Full";
        public decimal? DownPaymentPercent { get; set; }
        public int? LoanTerm { get; set; }
        public decimal? InterestRate { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    // DTOs for Orders
    public class CreateOrderDto
    {
        [Required]
        public int QuoteId { get; set; }
        [Required]
        public int SalespersonId { get; set; } // New: who handles the sale

        public int? DealerId { get; set; } // New: DealerID

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // New: e.g., Cash, Bank transfer, Financing via bank

        [Required]
        [StringLength(50)]
        public string PaymentType { get; set; } = string.Empty; // New: Cash / BankTransfer (semantic)

        [Required]
        public DateTime DeliveryDate { get; set; } // New: Preferred Delivery Date

        public string? Notes { get; set; }

        public required List<CreateOrderItemDto> OrderItems { get; set; } // New: List of order items
    }

    public class CreateOrderItemDto
    {
        [Required]
        public int VehicleId { get; set; }
        public int? VehicleModelId { get; set; }
        public int? VehicleVariantId { get; set; }
        public int? ColorId { get; set; }
        public int? ColorVariantId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        [Required]
        public decimal UnitPrice { get; set; }
        public decimal? Discount { get; set; }
        public string? PromotionApplied { get; set; }
    }

    public class OrderDto
    {
        public int OrderID { get; set; }
        public string? OrderNumber { get; set; }
        public int QuoteId { get; set; }
        public int CustomerId { get; set; }
        public int? DealerId { get; set; } // New: DealerID
        // Removed VehicleId and Quantity
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending"; // e.g., Pending, Confirmed, Shipped, Delivered, Cancelled
        public string PaymentStatus { get; set; } = "Pending"; // e.g., Pending, Paid, PartiallyPaid, Refunded
        public string PaymentMethod { get; set; } = string.Empty; // New
        public string PaymentType { get; set; } = string.Empty; // New
        public DateTime DeliveryDate { get; set; } // New
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public required List<OrderItemDto> OrderItems { get; set; } // New: List of order items
    }

    public class OrderItemDto
    {
        public int OrderItemID { get; set; }
        public int OrderId { get; set; }
        public int VehicleId { get; set; }
        public int? VehicleModelId { get; set; }
        public int? VehicleVariantId { get; set; }
        public int? ColorId { get; set; }
        public int? ColorVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? Discount { get; set; }
        public string? PromotionApplied { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // DTOs for Sales Contracts
    public class CreateContractDto
    {
        [Required]
        public int OrderId { get; set; }
        public string? ContractDetails { get; set; } // e.g., URL to document, or JSON string
    }

    public class ContractDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string ContractNumber { get; set; } = string.Empty;
        public string ContractDetails { get; set; } = string.Empty;
        public DateTime SignDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; } // Added UpdatedAt
    }

    // DTOs for Promotions
    public class CreatePromotionDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Range(0.01, 1000000000.00)] // Assuming discount value can be up to 1 billion
        public decimal DiscountValue { get; set; }

        [Required]
        [StringLength(50)]
        public string DiscountType { get; set; } = "Percentage"; // e.g., Percentage, FixedAmount

        [StringLength(50)]
        public string? ApplicableTo { get; set; } // e.g., "All", "Vehicles", "SpecificVehicleId:X"

        public int? VehicleId { get; set; } // If ApplicableTo is SpecificVehicleId
    }

    public class UpdatePromotionDto
    {
        [StringLength(200)]
        public string? Name { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Range(0.01, 1000000000.00)]
        public decimal? DiscountValue { get; set; }

        [StringLength(50)]
        public string? DiscountType { get; set; }

        [StringLength(50)]
        public string? ApplicableTo { get; set; }

        public int? VehicleId { get; set; }

        public bool? IsActive { get; set; }
    }

    public class PromotionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal DiscountValue { get; set; }
        public string DiscountType { get; set; } = string.Empty;
        public string? ApplicableTo { get; set; }
        public int? VehicleId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // DTOs for Deliveries
    public class CreateDeliveryDto
    {
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string TrackingNumber { get; set; } = string.Empty;

        [Required]
        public DateTime EstimatedDeliveryDate { get; set; }

        public DateTime? ActualDeliveryDate { get; set; } // Added
        
        [Required] // Added
        [StringLength(50)] // Added
        public string Status { get; set; } = "Pending"; // Added

        [StringLength(1000)]
        public string? Notes { get; set; }
    }

    public class UpdateDeliveryStatusDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;

        public DateTime? ActualDeliveryDate { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }
    }

    public class DeliveryDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        public DateTime EstimatedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // DTOs for Payments
    public class CreatePaymentDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        [Range(0.01, 10000000000.00)] // Assuming payment amount can be up to 10 billion
        public decimal Amount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow; // Added

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = "Cash"; // e.g., Cash, BankTransfer, Installment

        [Required] // Added
        [StringLength(50)] // Added
        public string Status { get; set; } = "Completed"; // Added

        [StringLength(200)]
        public string? TransactionId { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }
    }

    public class UpdatePaymentDto
    {
        [Range(0.01, 10000000000.00)]
        public decimal? Amount { get; set; }

        [StringLength(50)]
        public string? PaymentMethod { get; set; }

        [StringLength(50)]
        public string? Status { get; set; } // e.g., Completed, Pending, Failed, Refunded

        [StringLength(200)]
        public string? TransactionId { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }
    }

    public class PaymentDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // DTO for ordering vehicles from manufacturer
    public class CreateManufacturerOrderDto
    {
        [Required]
        public int DealerId { get; set; }
        [Required]
        public int VehicleId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        public string? Notes { get; set; }
    }
}
