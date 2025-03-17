dotnet clean
dotnet build
dotnet tool run dotnet-ef migrations add InitialCreate
dotnet tool run dotnet-ef migrations list
dotnet tool run dotnet-ef database update
