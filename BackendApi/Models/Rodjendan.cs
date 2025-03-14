using System.ComponentModel.DataAnnotations;

public class Rodjendan
{
    public int Id { get; set; }
    public string? Ime { get; set; }
    [DataType(DataType.Date)]
    public DateTime Datum { get; set; }
    public string? Slavljenik { get; set; }
}