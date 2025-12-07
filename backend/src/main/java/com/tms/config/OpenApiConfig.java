package com.tms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Transport Management System API")
                .version("1.0.0")
                .description("API documentation for TMS Backend - Manages loads, transporters, bids, and bookings")
                .contact(new Contact()
                    .name("TMS Support")
                    .email("careers@cargopro.ai")));
    }
}
