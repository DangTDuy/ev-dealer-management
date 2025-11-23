using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesService.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentDetailsToQuote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DownPaymentPercent",
                table: "Quotes",
                type: "decimal(5, 2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "InterestRate",
                table: "Quotes",
                type: "decimal(5, 2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoanTerm",
                table: "Quotes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentType",
                table: "Quotes",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DownPaymentPercent",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "InterestRate",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "LoanTerm",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "PaymentType",
                table: "Quotes");
        }
    }
}
