using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendApi.Models
{
    public class Rodjendan
    {
        [Key]
        public int Sifra { get; set; }

        [Required]
        public int SlavljenikSifra { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Ime { get; set; }

        [Required]
        public required DateTime Datum { get; set; }

        public DateTime? KrajDatum { get; set; }

        [MaxLength(50)]
        public string? Paket { get; set; }

        public int? BrojGostiju { get; set; }

        [MaxLength(20)]
        public string? Status { get; set; }

        public double? Cijena { get; set; }

        public double? Kapara { get; set; }

        public bool? KaparaPlacena { get; set; }

        [MaxLength(500)]
        public string? Napomena { get; set; }

        public DateTime DatumKreiranja { get; set; } = DateTime.UtcNow;

        public DateTime? DatumAzuriranja { get; set; }

        [ForeignKey("SlavljenikSifra")]
        [JsonIgnore]
        public virtual Slavljenik? SlavljenikNavigation { get; set; }
    }

    public class Slavljenik
    {
        [Key]
        public int Sifra { get; set; }

        [Required]
        [MaxLength(50)]
        public required string Ime { get; set; }

        [Required]
        [MaxLength(50)]
        public required string Prezime { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Email { get; set; }

        [Required]
        [MaxLength(20)]
        public required string Telefon { get; set; }

        public DateTime? Datum { get; set; }

        [MaxLength(500)]
        public string? Napomena { get; set; }

        public DateTime DatumKreiranja { get; set; } = DateTime.UtcNow;

        public DateTime? DatumAzuriranja { get; set; }

        [JsonIgnore]
        public virtual ICollection<Rodjendan>? Rodjendani { get; set; } = new List<Rodjendan>();
    }
}
