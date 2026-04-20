package com.example.tfg_backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String currentDir = System.getProperty("user.dir");
        File envFile = new File(currentDir, ".env");

        if (!envFile.exists()) {
            envFile = new File(currentDir + "/tfg_backend/.env");
        }

        if (envFile.exists()) {
            Map<String, Object> properties = new HashMap<>();
            try {
                Path envPath = envFile.toPath();
                Files.lines(envPath)
                        .filter(line -> !line.trim().isEmpty() && !line.trim().startsWith("#"))
                        .forEach(line -> {
                            int equalsIndex = line.indexOf('=');
                            if (equalsIndex > 0) {
                                String key = line.substring(0, equalsIndex).trim();
                                String value = line.substring(equalsIndex + 1).trim();
                                properties.put(key, value);
                            }
                        });

                if (!properties.isEmpty()) {
                    environment.getPropertySources()
                            .addFirst(new MapPropertySource("dotenv", properties));
                }
            } catch (IOException e) {
                System.out.println("Error reading .env file: " + e.getMessage());
            }
        }
    }
}
