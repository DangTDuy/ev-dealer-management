using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesService.Migrations
{
    public partial class AddOrderNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add nullable OrderNumber column
            migrationBuilder.AddColumn<string>(
                name: "OrderNumber",
                table: "Orders",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            // Populate existing orders with a generated value (ORD-{Id}-{timestamp})
            migrationBuilder.Sql(@"UPDATE Orders SET OrderNumber = 'ORD-' || Id || '-' || strftime('%Y%m%d%H%M%f','now') WHERE OrderNumber IS NULL;");

            // Create unique index on OrderNumber
            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderNumber",
                table: "Orders",
                column: "OrderNumber",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Orders_OrderNumber",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "OrderNumber",
                table: "Orders");
        }
    }
}
