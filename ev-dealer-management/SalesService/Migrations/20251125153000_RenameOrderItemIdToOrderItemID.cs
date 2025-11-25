using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesService.Migrations
{
    public partial class RenameOrderItemIdToOrderItemID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Rename column Id to OrderItemID in OrderItems table
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "OrderItems",
                newName: "OrderItemID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OrderItemID",
                table: "OrderItems",
                newName: "Id");
        }
    }
}
