package com.Revature.Ecommerce.Platform.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Double> getEmbedding(String text) {

        try {

            String url = "http://localhost:11434/api/embeddings";

            Map<String, Object> body = new HashMap<>();

            body.put("model", "nomic-embed-text");
            body.put("prompt", text);

            Map response = restTemplate.postForObject(
                    url,
                    body,
                    Map.class
            );

            return (List<Double>) response.get("embedding");

        } catch (Exception e) {

            throw new RuntimeException(
                    "AI embedding service unavailable"
            );
        }
    }
}