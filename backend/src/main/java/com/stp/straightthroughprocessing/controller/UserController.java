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

}
