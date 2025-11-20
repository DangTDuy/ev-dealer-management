using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VehicleService.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dealers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Region = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Contact = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dealers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VehicleTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Value = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Label = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Model = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    BatteryCapacity = table.Column<double>(type: "REAL", nullable: false),
                    Range = table.Column<int>(type: "INTEGER", nullable: false),
                    StockQuantity = table.Column<int>(type: "INTEGER", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    DealerId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    VehicleTypeId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vehicles_Dealers_DealerId",
                        column: x => x.DealerId,
                        principalTable: "Dealers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Vehicles_VehicleTypes_VehicleTypeId",
                        column: x => x.VehicleTypeId,
                        principalTable: "VehicleTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ColorVariants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Hex = table.Column<string>(type: "TEXT", maxLength: 7, nullable: false),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    VehicleId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColorVariants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ColorVariants_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VehicleImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Url = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    AltText = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    VehicleId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehicleImages_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VehicleSpecifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Acceleration = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    TopSpeed = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Charging = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Warranty = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Seats = table.Column<int>(type: "INTEGER", nullable: true),
                    Cargo = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    VehicleId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleSpecifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehicleSpecifications_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VehicleId = table.Column<int>(type: "INTEGER", nullable: false),
                    ColorVariantId = table.Column<int>(type: "INTEGER", nullable: true),
                    CustomerName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    CustomerEmail = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    CustomerPhone = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservations_ColorVariants_ColorVariantId",
                        column: x => x.ColorVariantId,
                        principalTable: "ColorVariants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Reservations_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Dealers",
                columns: new[] { "Id", "Address", "Contact", "CreatedAt", "Email", "Name", "Region", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "123 Nguyen Hue, District 1, HCMC", "0901234567", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1469), "hcmc@tesla.com", "Tesla Center HCMC", "Ho Chi Minh City", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1470) },
                    { 2, "456 Le Loi, District 1, HCMC", "0902345678", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1473), "district1@bmw.com", "BMW Center District 1", "Ho Chi Minh City", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1474) },
                    { 3, "789 Dong Khoi, District 2, HCMC", "0903456789", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1478), "district2@audi.com", "Audi Center District 2", "Ho Chi Minh City", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1478) },
                    { 4, "321 Nguyen Van Cu, District 3, HCMC", "0904567890", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1550), "district3@mercedes.com", "Mercedes-Benz Center District 3", "Ho Chi Minh City", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1551) }
                });

            migrationBuilder.InsertData(
                table: "VehicleTypes",
                columns: new[] { "Id", "Label", "Value" },
                values: new object[,]
                {
                    { 1, "Sedan", "sedan" },
                    { 2, "SUV", "suv" },
                    { 3, "Hatchback", "hatchback" },
                    { 4, "Coupe", "coupe" },
                    { 5, "Convertible", "convertible" },
                    { 6, "Truck", "truck" }
                });

            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "Id", "BatteryCapacity", "CreatedAt", "DealerId", "Description", "Model", "Price", "Range", "StockQuantity", "Type", "UpdatedAt", "VehicleTypeId" },
                values: new object[,]
                {
                    { 1, 75.0, new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1592), 1, "Premium electric sedan with autopilot capabilities", "Tesla Model 3", 45000m, 350, 12, "sedan", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1592), null },
                    { 2, 75.0, new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1597), 1, "Versatile electric SUV perfect for families", "Tesla Model Y", 55000m, 330, 8, "suv", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1598), null },
                    { 3, 83.900000000000006, new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1601), 2, "Luxury electric sedan with BMW's signature driving dynamics", "BMW i4", 52000m, 300, 6, "sedan", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1602), null },
                    { 4, 95.0, new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1605), 3, "Premium electric SUV with quattro all-wheel drive", "Audi e-tron", 65000m, 222, 4, "suv", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1606), null },
                    { 5, 107.8, new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1609), 4, "Ultra-luxury electric sedan with cutting-edge technology", "Mercedes EQS", 120000m, 350, 2, "sedan", new DateTime(2025, 11, 20, 9, 50, 43, 541, DateTimeKind.Utc).AddTicks(1610), null }
                });

            migrationBuilder.InsertData(
                table: "ColorVariants",
                columns: new[] { "Id", "Hex", "Name", "Stock", "VehicleId" },
                values: new object[,]
                {
                    { 1, "#FFFFFF", "Pearl White", 5, 1 },
                    { 2, "#2C2C2C", "Midnight Silver", 4, 1 },
                    { 3, "#1E3A8A", "Deep Blue", 3, 1 },
                    { 4, "#FFFFFF", "Pearl White", 3, 2 },
                    { 5, "#2C2C2C", "Midnight Silver", 3, 2 },
                    { 6, "#DC2626", "Red Multi-Coat", 2, 2 },
                    { 7, "#FFFFFF", "Alpine White", 2, 3 },
                    { 8, "#F5F5F5", "Mineral White", 2, 3 },
                    { 9, "#000000", "Black Sapphire", 2, 3 },
                    { 10, "#FFFFFF", "Glacier White", 2, 4 },
                    { 11, "#000000", "Mythos Black", 1, 4 },
                    { 12, "#C8102E", "Tango Red", 1, 4 },
                    { 13, "#000000", "Obsidian Black", 1, 5 },
                    { 14, "#FFFFFF", "Diamond White", 1, 5 }
                });

            migrationBuilder.InsertData(
                table: "VehicleImages",
                columns: new[] { "Id", "AltText", "Order", "Url", "VehicleId" },
                values: new object[,]
                {
                    { 1, "Tesla Model 3 Front", 1, "/src/assets/img/car1.png", 1 },
                    { 2, "Tesla Model 3 Side", 2, "/src/assets/img/car2.png", 1 },
                    { 3, "Tesla Model 3 Interior", 3, "/src/assets/img/car3.png", 1 },
                    { 4, "Tesla Model Y Front", 1, "/src/assets/img/car2.png", 2 },
                    { 5, "Tesla Model Y Side", 2, "/src/assets/img/car3.png", 2 },
                    { 6, "Tesla Model Y Interior", 3, "/src/assets/img/car4.png", 2 },
                    { 7, "BMW i4 Front", 1, "/src/assets/img/car3.png", 3 },
                    { 8, "BMW i4 Side", 2, "/src/assets/img/car4.png", 3 },
                    { 9, "Audi e-tron Front", 1, "/src/assets/img/car4.png", 4 },
                    { 10, "Mercedes EQS Front", 1, "/src/assets/img/car1.png", 5 },
                    { 11, "Mercedes EQS Side", 2, "/src/assets/img/car2.png", 5 }
                });

            migrationBuilder.InsertData(
                table: "VehicleSpecifications",
                columns: new[] { "Id", "Acceleration", "Cargo", "Charging", "Seats", "TopSpeed", "VehicleId", "Warranty" },
                values: new object[,]
                {
                    { 1, "3.1s 0-60mph", "15 cu ft", "250 kW Supercharging", 5, "162 mph", 1, "4 years/50,000 miles" },
                    { 2, "3.5s 0-60mph", "76 cu ft", "250 kW Supercharging", 7, "155 mph", 2, "4 years/50,000 miles" },
                    { 3, "3.9s 0-60mph", "16 cu ft", "150 kW DC Fast Charging", 5, "118 mph", 3, "4 years/50,000 miles" },
                    { 4, "5.5s 0-60mph", "27.2 cu ft", "150 kW DC Fast Charging", 5, "124 mph", 4, "4 years/50,000 miles" },
                    { 5, "4.3s 0-60mph", "22 cu ft", "200 kW DC Fast Charging", 5, "130 mph", 5, "4 years/50,000 miles" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ColorVariants_VehicleId",
                table: "ColorVariants",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ColorVariantId",
                table: "Reservations",
                column: "ColorVariantId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_VehicleId",
                table: "Reservations",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleImages_VehicleId",
                table: "VehicleImages",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_DealerId",
                table: "Vehicles",
                column: "DealerId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_VehicleTypeId",
                table: "Vehicles",
                column: "VehicleTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleSpecifications_VehicleId",
                table: "VehicleSpecifications",
                column: "VehicleId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "VehicleImages");

            migrationBuilder.DropTable(
                name: "VehicleSpecifications");

            migrationBuilder.DropTable(
                name: "ColorVariants");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "Dealers");

            migrationBuilder.DropTable(
                name: "VehicleTypes");
        }
    }
}
