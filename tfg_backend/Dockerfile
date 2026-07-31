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

# Configurar memoria de Java (Render proporciona 512MB-1GB)
ENV JAVA_OPTS="-Xmx256m -Xms128m"

# Spring Boot profile (prod siempre en Render)
ENV SPRING_PROFILES_ACTIVE=prod

# Los secretos vienen de Render via variables de entorno:
# - SPRING_DATASOURCE_URL
# - SPRING_DATASOURCE_USERNAME
# - SPRING_DATASOURCE_PASSWORD
# - JWT_SECRET
# - JWT_EXPIRATION
# - MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM
# - FRONTEND_URL

# Exponer el puerto (Render inyecta PORT=10000)
EXPOSE 8080

# Ejecutar la aplicación con timeouts y heap dump si falla
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxGCPauseMillis=200", "-Djava.awt.headless=true", "-jar", "app.jar"]
