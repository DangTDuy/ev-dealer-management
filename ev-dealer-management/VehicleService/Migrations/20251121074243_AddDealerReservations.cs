using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VehicleService.Migrations
{
    /// <inheritdoc />
    public partial class AddDealerReservations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2392), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2395) });

            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2406), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2407) });

            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2411), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2412) });

            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2417), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2418) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2513), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2515) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2521), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2522) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2527), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2528) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2537), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2537) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2542), new DateTime(2025, 11, 21, 7, 42, 40, 297, DateTimeKind.Utc).AddTicks(2542) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1469), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1470) });

            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1473), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1474) });

            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1478), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1478) });

            migrationBuilder.UpdateData(
                table: "Dealers",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1550), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1551) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1592), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1592) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1597), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1598) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1601), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1602) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1605), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1606) });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1609), new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1610) });
        }
    }
}
