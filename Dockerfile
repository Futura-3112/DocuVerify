FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Docu_Verify.Api/Docu_Verify.Api.csproj", "Docu_Verify.Api/"]
RUN dotnet restore "Docu_Verify.Api/Docu_Verify.Api.csproj"
COPY . .
WORKDIR "/src/Docu_Verify.Api"
RUN dotnet build "Docu_Verify.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Docu_Verify.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8443
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Docu_Verify.Api.dll"]
