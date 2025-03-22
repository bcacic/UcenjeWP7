using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Slavljenici",
                columns: table => new
                {
                    Sifra = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Ime = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Telefon = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Datum = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Napomena = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    DatumKreiranja = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DatumAzuriranja = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Slavljenici", x => x.Sifra);
                });

            migrationBuilder.CreateTable(
                name: "Rodjendani",
                columns: table => new
                {
                    Sifra = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SlavljenikSifra = table.Column<int>(type: "INTEGER", nullable: false),
                    Ime = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Datum = table.Column<DateTime>(type: "TEXT", nullable: false),
                    KrajDatum = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Paket = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    BrojGostiju = table.Column<int>(type: "INTEGER", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Cijena = table.Column<double>(type: "REAL", nullable: true),
                    Kapara = table.Column<double>(type: "REAL", nullable: true),
                    KaparaPlacena = table.Column<bool>(type: "INTEGER", nullable: true),
                    Napomena = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    DatumKreiranja = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DatumAzuriranja = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rodjendani", x => x.Sifra);
                    table.ForeignKey(
                        name: "FK_Rodjendani_Slavljenici_SlavljenikSifra",
                        column: x => x.SlavljenikSifra,
                        principalTable: "Slavljenici",
                        principalColumn: "Sifra",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rodjendani_SlavljenikSifra",
                table: "Rodjendani",
                column: "SlavljenikSifra");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rodjendani");

            migrationBuilder.DropTable(
                name: "Slavljenici");
        }
    }
}
