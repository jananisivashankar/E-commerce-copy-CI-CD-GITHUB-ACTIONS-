package com.Revature.Ecommerce.Platform;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class EcommercePlatformApplication {

    private static final Logger log =
            LoggerFactory.getLogger(EcommercePlatformApplication.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostConstruct
    public void testMongoConnection() {

        try {

            String dbName =
                    mongoTemplate.getDb().getName();

            log.info(
                    "Connected to MongoDB Database: {}",
                    dbName
            );

        } catch (Exception e) {

            log.error(
                    "MongoDB Connection Failed",
                    e
            );
        }
    }

    public static void main(String[] args) {

        SpringApplication.run(
                EcommercePlatformApplication.class,
                args
        );
    }
}