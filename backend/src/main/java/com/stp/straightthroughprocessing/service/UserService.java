package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.User;
import com.stp.straightthroughprocessing.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User getUserById(Long userId){
        return userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public Double modifyCash(Long userId, Double amount){
        User updatedUser = this.getUserById(userId);
        updatedUser.setCash(
                this.getUserById(userId).getCash() + amount
        );
        User res = userRepo.save(updatedUser);
        return res.getCash();
    }
}
