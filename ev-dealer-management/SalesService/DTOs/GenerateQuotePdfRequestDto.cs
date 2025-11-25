namespace SalesService.DTOs
{
    public class GenerateQuotePdfRequestDto
    {
        public CustomerInfoDto CustomerInfo { get; set; }
        public List<QuoteItemPdfDto> QuoteItems { get; set; }
        public PaymentInfoPdfDto PaymentInfo { get; set; }
        public AdditionalInfoPdfDto AdditionalInfo { get; set; }
        public decimal TotalCalculatedAmount { get; set; } // Total from frontend calculation
        public decimal DownPaymentCalculated { get; set; } // Down payment from frontend calculation
        public decimal MonthlyPaymentCalculated { get; set; } // Monthly payment from frontend calculation
        public decimal InstallmentTotalPaymentCalculated { get; set; } // Total installment payment from frontend calculation
    }

    public class CustomerInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
    }

    public class QuoteItemPdfDto
    {
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; } // Percentage
        public decimal ItemTotal { get; set; } // Calculated total for this item
    }

    public class PaymentInfoPdfDto
    {
        public string Type { get; set; } // "full" or "installment"
        public decimal? DownPaymentPercent { get; set; } // Nullable for full payment
        public int? LoanTerm { get; set; } // Nullable for full payment (months)
        public decimal? InterestRate { get; set; } // Nullable for full payment (%)
    }

    public class AdditionalInfoPdfDto
    {
        public string DeliveryDate { get; set; } // Stored as string from date input
        public string Notes { get; set; }
        public string SalesPerson { get; set; }
        public string ValidUntil { get; set; } // Stored as string from date input
    }
}
