using Microsoft.EntityFrameworkCore;
using BackendApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:8080") // Frontend URL
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()); // Allow credentials
});

// Add SQLite Database with connection string from appsettings.json
builder.Services.AddDbContext<RodjendanDb>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("RodjendanContext")));

builder.Services.AddControllers();

// Swagger/OpenAPI setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "RodjendanAPI";
    config.Title = "RodjendanAPI v1";
    config.Version = "v1";
});

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

// Use OpenAPI/Swagger for documentation
app.UseOpenApi();
app.UseSwaggerUi(config =>
{
    config.DocumentTitle = "RodjendanAPI";
    config.Path = "/swagger";
    config.DocumentPath = "/swagger/{documentName}/swagger.json";
    config.DocExpansion = "list";
});

// Enable routing and map controllers
app.UseRouting();
app.MapControllers();

app.Run();
