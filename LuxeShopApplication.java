package com.luxeshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * LuxeShop E-Commerce Backend
 * Entry point for the Spring Boot application.
 */
@SpringBootApplication
@EnableJpaAuditing
public class LuxeShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(LuxeShopApplication.class, args);
    }
}
git init
git add .
git commit -m "Add DSS Shop e-commerce application"
git remote add origin https://github.com/DHAVASEELAN3/E-Commerce.git
git push -u origin main