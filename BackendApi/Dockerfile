# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the .csproj file and restore the dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the application code
COPY . ./

# Install dotnet-ef tool for migrations
RUN dotnet tool install --global dotnet-ef

# Set PATH for global tools
ENV PATH="$PATH:/root/.dotnet/tools"

# Run tool restore to ensure dotnet-ef is available
RUN dotnet tool restore

# Publish the application for release (remove unnecessary build files)
RUN dotnet publish -c Release -o out

# Run migrations before starting the application (assuming you have an EF migration set up)
RUN dotnet ef database update --project ./BackendApi.csproj --startup-project ./BackendApi.csproj

# Set the entrypoint to run the application
ENTRYPOINT ["dotnet", "./out/BackendApi.dll"]
