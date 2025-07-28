package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.User;
import com.stp.straightthroughprocessing.repository.UserRepository;
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
}
