using Microsoft.EntityFrameworkCore;
using BackendApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add SQLite Database
builder.Services.AddDbContext<RodjendanDb>(opt => opt.UseSqlite(builder.Configuration.GetConnectionString("RodjendanContext")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "RodjendanAPI";
    config.Title = "RodjendanAPI v1";
    config.Version = "v1";
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "RodjendanAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

app.MapGet("/Rodjendani", async (RodjendanDb db) =>
    await db.Rodjendans.ToListAsync());

app.MapGet("/Rodjendani/{id}", async (int id, RodjendanDb db) =>
    await db.Rodjendans.FindAsync(id)
        is Rodjendan Rodjendan
            ? Results.Ok(Rodjendan)
            : Results.NotFound());

app.MapPost("/Rodjendani", async (Rodjendan Rodjendan, RodjendanDb db) =>
{
    db.Rodjendans.Add(Rodjendan);
    await db.SaveChangesAsync();

    return Results.Created($"/Rodjendani/{Rodjendan.Id}", Rodjendan);
});

app.MapPut("/Rodjendani/{id}", async (int id, Rodjendan inputRodjendan, RodjendanDb db) =>
{
    var Rodjendan = await db.Rodjendans.FindAsync(id);

    if (Rodjendan is null) return Results.NotFound();

    Rodjendan.Ime = inputRodjendan.Ime;
    Rodjendan.Datum = inputRodjendan.Datum;
    Rodjendan.Slavljenik = inputRodjendan.Slavljenik;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/Rodjendani/{id}", async (int id, RodjendanDb db) =>
{
    if (await db.Rodjendans.FindAsync(id) is Rodjendan Rodjendan)
    {
        db.Rodjendans.Remove(Rodjendan);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});

app.Run();
