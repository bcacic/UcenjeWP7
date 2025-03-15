using Microsoft.EntityFrameworkCore;
using BackendApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add SQLite Database
builder.Services.AddDbContext<RodjendanDb>(opt => opt.UseSqlite(builder.Configuration.GetConnectionString("RodjendanContext")));

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
