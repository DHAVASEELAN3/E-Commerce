package com.dssshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * DSS Shop E-Commerce Backend
 * Entry point for the Spring Boot application.
 */
@SpringBootApplication
@EnableJpaAuditing
public class LuxeShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(LuxeShopApplication.class, args);
    }
}
