package com.stp.straightthroughprocessing.controller;

import com.stp.straightthroughprocessing.model.User;
import com.stp.straightthroughprocessing.model.request.ModifyBalanceUser;
import com.stp.straightthroughprocessing.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/all")
    public ResponseEntity<List<User>> getUsers() {
        return new ResponseEntity<>(this.userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return new ResponseEntity<>(this.userService.getUserById(id), HttpStatus.OK);
    }

    @PostMapping("/modify-balance")
    @ResponseBody
    public ResponseEntity<Long> updateCash(@RequestBody ModifyBalanceUser modifyBalanceUser) {
        Long updatedBalance = this.userService.modifyCash(modifyBalanceUser.id, modifyBalanceUser.amount);
        return new ResponseEntity<>(updatedBalance, HttpStatus.OK);
    }


//    @GetMapping(value = "/sse/messages", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public Flux<String> streamMessages() {
//        // Flux.interval generates a sequence of Long values at a fixed rate.
//        // Here, it emits a value every 1 second.
//        return Flux.interval(Duration.ofSeconds(1))
//                // Map each emitted Long value to a custom String message.
//                // The message includes the current index to show progression.
//                .map(sequence -> "Message from server: " + sequence + " at " + java.time.LocalTime.now());
//    }
}
