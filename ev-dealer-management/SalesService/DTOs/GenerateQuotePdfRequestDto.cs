namespace SalesService.DTOs
{
    public class GenerateQuotePdfRequestDto
    {
        public required CustomerInfoDto CustomerInfo { get; set; }
        public required List<QuoteItemPdfDto> QuoteItems { get; set; }
        public required PaymentInfoPdfDto PaymentInfo { get; set; }
        public required AdditionalInfoPdfDto AdditionalInfo { get; set; }
        public required decimal TotalCalculatedAmount { get; set; } // Total from frontend calculation
        public required decimal DownPaymentCalculated { get; set; } // Down payment from frontend calculation
        public required decimal MonthlyPaymentCalculated { get; set; } // Monthly payment from frontend calculation
        public required decimal InstallmentTotalPaymentCalculated { get; set; } // Total installment payment from frontend calculation
    }

    public class CustomerInfoDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string Phone { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
    }

    public class QuoteItemPdfDto
    {
        public required int VehicleId { get; set; }
        public required string VehicleName { get; set; }
        public required int Quantity { get; set; }
        public required decimal UnitPrice { get; set; }
        public required decimal Discount { get; set; } // Percentage
        public required decimal ItemTotal { get; set; } // Calculated total for this item
    }

    public class PaymentInfoPdfDto
    {
        public required string Type { get; set; } // "full" or "installment"
        public decimal? DownPaymentPercent { get; set; } // Nullable for full payment
        public int? LoanTerm { get; set; } // Nullable for full payment (months)
        public decimal? InterestRate { get; set; } // Nullable for full payment (%)
    }

    public class AdditionalInfoPdfDto
    {
        public required string DeliveryDate { get; set; } // Stored as string from date input
        public required string Notes { get; set; }
        public required string SalesPerson { get; set; }
        public required string ValidUntil { get; set; } // Stored as string from date input
    }
}
