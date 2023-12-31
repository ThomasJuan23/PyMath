package com.example.pymath1.service;

import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CodeExecutionService {
  //get key from application.properties
    @Value("${rapidapi.key}")
    private String rapidapiKey;
    //get host from application.properties
    @Value("${rapidapi.host}")
    private String rapidapiHost;
    public String executeCode(String code) throws Exception {
        final String ENCODING = "UTF-8";
        // Base64 encoding using Apache Commons Codec
        String encodedCode = new String(Base64.encodeBase64(code.getBytes(ENCODING)), ENCODING);
        //create a submission request
        HttpResponse<JsonNode> response = Unirest.post("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*")
                .header("content-type", "application/json")
                .header("Content-Type", "application/json")
                .header("X-RapidAPI-Key", rapidapiKey)
                .header("X-RapidAPI-Host", rapidapiHost)
                .body("{ \"language_id\": 71, \"source_code\": \"" + encodedCode + "\" }")
                .asJson();
        if (response.getStatus() != 201) {
            throw new Exception("Failed to communicate with RapidAPI: " + response.getBody().toString());
        }
        String submissionId = response.getBody().getObject().getString("token");
        int statusId;
        int maxAttempts = 20;
        int currentAttempt = 0;
        //loop until the status of get a submission is finished
        do {
            Thread.sleep(200);
            response = Unirest.get("https://judge0-ce.p.rapidapi.com/submissions/" + submissionId + "?base64_encoded=true&fields=*")
                    .header("X-RapidAPI-Key", rapidapiKey)
                    .header("X-RapidAPI-Host", rapidapiHost)
                    .asJson();
            statusId = response.getBody().getObject().getInt("status_id");
            currentAttempt++;
        } while ((statusId == 1 || statusId == 2) && currentAttempt < maxAttempts);
        if (statusId == 1 || statusId == 2) {
            return "Execution took too long. Please try again.";
        }
        String output = response.getBody().getObject().optString("stdout");
        String error = response.getBody().getObject().optString("stderr");
        if (!output.isEmpty()) {
            // Base64 decoding using Apache Commons Codec
            return new String(Base64.decodeBase64(output), ENCODING);
        } else if (!error.isEmpty()) {
            // Base64 decoding using Apache Commons Codec
            error = new String(Base64.decodeBase64(error), ENCODING);
            return error;
        } else {
            return "No output available.";
        }
    }
}
