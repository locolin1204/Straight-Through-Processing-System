package com.stp.straightthroughprocessing.controller;

import jakarta.annotation.PostConstruct;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class LiveDataController {

//    @MessageMapping("/live")
//    @SendTo("/topic/greetings")
//    public String greeting(String message) throws Exception {
//        Thread.sleep(1000); // Simulated delay
//        // Simulate a response by including the original message, a timestamp, and a custom reply
//        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
//        return "Received: " + HtmlUtils.htmlEscape(message) + " | Response at " + timestamp + ": Hello, this is a simulated response!";
//    }

    private final SimpMessagingTemplate messagingTemplate;
    public LiveDataController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostConstruct
    public void sendPeriodicHello() {
        new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(1000); // 5-second delay
                    String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                    messagingTemplate.convertAndSend("/topic/greetings", "hello | Sent at " + timestamp);
                    System.out.println("yo boi");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }).start();
    }

    @MessageMapping("/live")
    @SendTo("/topic/greetings")
    public String greeting(String message) throws Exception {
        Thread.sleep(1000); // Simulated delay
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return "Received: " + HtmlUtils.htmlEscape(message) + " | Response at " + timestamp + ": Hello, this is a simulated response!";
    }
}
