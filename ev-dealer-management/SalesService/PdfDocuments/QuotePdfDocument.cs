using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SalesService.DTOs;

namespace SalesService.PdfDocuments
{
    public class QuotePdfDocument : IDocument
    {
        public GenerateQuotePdfRequestDto Model { get; }

        public QuotePdfDocument(GenerateQuotePdfRequestDto model)
        {
            Model = model;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            // Apply default font for the entire document to support Vietnamese
            container.Page(page =>
            {
                // `Page(...)` provides an `IContainer`-like receiver where
                // `DefaultTextStyle` extension methods are available.
                page.DefaultTextStyle(x => x.FontFamily("Arial")); // Apply Arial font

                page.Margin(50);

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
        }

        void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text("BÁO GIÁ XE ĐIỆN").FontSize(24).Bold().FontColor(Colors.Blue.Medium);
                    column.Item().Text($"Ngày báo giá: {DateTime.Now:dd/MM/yyyy}").FontSize(10).FontColor(Colors.Grey.Medium);
                });

                // row.ConstantItem(100).Image("logo.png"); // Commented out: Placeholder for a logo
            });
        }

        void ComposeContent(IContainer container)
        {
            container.PaddingVertical(40).Column(column =>
            {
                column.Spacing(20);

                column.Item().Element(ComposeCustomerInfo);
                column.Item().Element(ComposeQuoteItems);
                column.Item().Element(ComposePaymentInfo);
                column.Item().Element(ComposeAdditionalInfo);
                column.Item().Element(ComposeSummary);
            });
        }

        void ComposeCustomerInfo(IContainer container)
        {
            container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(column =>
            {
                column.Item().Text("THÔNG TIN KHÁCH HÀNG").FontSize(14).Bold().Underline();
                column.Spacing(5);

                column.Item().Text($"Tên khách hàng: {Model.CustomerInfo.Name}");
                column.Item().Text($"Số điện thoại: {Model.CustomerInfo.Phone}");
                column.Item().Text($"Email: {Model.CustomerInfo.Email}");
                column.Item().Text($"Địa chỉ: {Model.CustomerInfo.Address}");
            });
        }

        void ComposeQuoteItems(IContainer container)
        {
            container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(column =>
            {
                column.Item().Text("CHI TIẾT XE").FontSize(14).Bold().Underline();
                column.Spacing(5);

                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(3);
                        columns.RelativeColumn(1);
                        columns.RelativeColumn(2);
                        columns.RelativeColumn(1);
                        columns.RelativeColumn(2);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Element(CellStyle).Text("Tên xe");
                        header.Cell().Element(CellStyle).Text("Số lượng");
                        header.Cell().Element(CellStyle).AlignRight().Text("Đơn giá");
                        header.Cell().Element(CellStyle).AlignRight().Text("Giảm giá (%)");
                        header.Cell().Element(CellStyle).AlignRight().Text("Thành tiền");

                        static IContainer CellStyle(IContainer container) => container.DefaultTextStyle(x => x.Bold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                    });

                    foreach (var item in Model.QuoteItems)
                    {
                        table.Cell().Element(CellStyle).Text(item.VehicleName);
                        table.Cell().Element(CellStyle).Text(item.Quantity.ToString());
                        table.Cell().Element(CellStyle).AlignRight().Text(FormatCurrency(item.UnitPrice));
                        table.Cell().Element(CellStyle).AlignRight().Text($"{item.Discount}%");
                        table.Cell().Element(CellStyle).AlignRight().Text(FormatCurrency(item.ItemTotal));

                        static IContainer CellStyle(IContainer container) => container.PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten3);
                    }
                });
            });
        }

        void ComposePaymentInfo(IContainer container)
        {
            container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(column =>
            {
                column.Item().Text("THÔNG TIN THANH TOÁN").FontSize(14).Bold().Underline();
                column.Spacing(5);

                column.Item().Text($"Hình thức: {GetPaymentTypeDisplayName(Model.PaymentInfo.Type)}");

                if (Model.PaymentInfo.Type == "installment")
                {
                    column.Item().Text($"Trả trước: {Model.PaymentInfo.DownPaymentPercent}%");
                    column.Item().Text($"Kỳ hạn: {Model.PaymentInfo.LoanTerm} tháng");
                    column.Item().Text($"Lãi suất: {Model.PaymentInfo.InterestRate}%/năm");
                    column.Item().Text($"Số tiền vay: {FormatCurrency(Model.DownPaymentCalculated)}"); // This should be LoanAmount
                    column.Item().Text($"Góp hàng tháng: {FormatCurrency(Model.MonthlyPaymentCalculated)}");
                }
            });
        }

        void ComposeAdditionalInfo(IContainer container)
        {
            container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(column =>
            {
                column.Item().Text("THÔNG TIN BỔ SUNG").FontSize(14).Bold().Underline();
                column.Spacing(5);

                column.Item().Text($"Nhân viên bán hàng: {Model.AdditionalInfo.SalesPerson}");
                column.Item().Text($"Ngày giao xe dự kiến: { (string.IsNullOrWhiteSpace(Model.AdditionalInfo.DeliveryDate) ? "Chưa xác định" : Model.AdditionalInfo.DeliveryDate) }");
                column.Item().Text($"Báo giá có hiệu lực đến: { (string.IsNullOrWhiteSpace(Model.AdditionalInfo.ValidUntil) ? "Chưa xác định" : Model.AdditionalInfo.ValidUntil) }");
                column.Item().Text($"Ghi chú: { (string.IsNullOrWhiteSpace(Model.AdditionalInfo.Notes) ? "Không có" : Model.AdditionalInfo.Notes) }");
            });
        }

        void ComposeSummary(IContainer container)
        {
            container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(column =>
            {
                column.Spacing(5);
                column.Item().AlignRight().Text($"Tổng cộng: {FormatCurrency(Model.TotalCalculatedAmount)}").FontSize(12);

                if (Model.PaymentInfo.Type == "installment")
                {
                    column.Item().AlignRight().Text($"Tổng thanh toán (trả góp): {FormatCurrency(Model.InstallmentTotalPaymentCalculated)}").FontSize(14).Bold().FontColor(Colors.Blue.Medium);
                }
                else
                {
                    column.Item().AlignRight().Text($"Tổng thanh toán: {FormatCurrency(Model.TotalCalculatedAmount)}").FontSize(14).Bold().FontColor(Colors.Blue.Medium);
                }
            });
        }

        void ComposeFooter(IContainer container)
        {
            container.AlignRight().Text(text =>
            {
                text.Span("Trang ").FontSize(10);
                text.CurrentPageNumber().FontSize(10);
                text.Span(" / ").FontSize(10);
                text.TotalPages().FontSize(10);
            });
        }

        private string FormatCurrency(decimal amount)
        {
            // Using Vietnamese culture for currency formatting
            var culture = new System.Globalization.CultureInfo("vi-VN");
            return string.Format(culture, "{0:C0}", amount);
        }

        private string GetPaymentTypeDisplayName(string type)
        {
            return type switch
            {
                "full" => "Trả toàn bộ",
                "installment" => "Trả góp",
                _ => type
            };
        }
    }
}
