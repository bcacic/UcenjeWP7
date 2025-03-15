dotnet clean
dotnet build
dotnet ef migrations add InitialCreate
dotnet ef migrations list
dotnet ef database update
