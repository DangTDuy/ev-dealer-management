using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesService.Migrations
{
    public partial class RenameOrderIdToOrderID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Rename column Id to OrderID in Orders table
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Orders",
                newName: "OrderID");

            // If there are indexes or FKs that reference the old column name, EF will handle them when recreating the table for SQLite.
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OrderID",
                table: "Orders",
                newName: "Id");
        }
    }
}
