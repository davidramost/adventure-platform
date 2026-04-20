# --- Etapa de Build ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar el pom.xml y descargar dependencias (se cachea)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el código fuente y construir el JAR
COPY src ./src
RUN mvn clean package -DskipTests

# --- Etapa de Runtime ---
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Copiar el JAR desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Configurar variables de entorno por defecto (Render sobreescribe estas)
ENV SPRING_PROFILES_ACTIVE=prod \
    DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com \
    DB_PORT=4000 \
    DB_NAME=rutas_app \
    DB_USER=${DB_USER} \
    DB_PASSWORD=${DB_PASSWORD}

# Exponer el puerto (Render lo sobreescribe con $PORT)
EXPOSE 8080


# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
