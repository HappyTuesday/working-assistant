package com.nick.working.assistant.supplier.develop.controllers;

import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import com.nick.working.assistant.supplier.develop.models.User;
import com.nick.working.assistant.supplier.develop.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/supplier/develop/users")
public class UserController {
    private final UserRepository repository;

    @Autowired
    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<User> findAll() {
        List<User> list = new ArrayList<>();
        for (UserDTO dto : repository.findAll()) {
            list.add(new User(dto));
        }
        return list;
    }

    @GetMapping("{id}")
    public User get(@PathVariable int id) {
        Optional<UserDTO> result = repository.findById(id);
        if (result.isPresent()) {
            return new User(result.get());
        } else {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping
    public int add(User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        user.setUsername(user.getUsername().trim());
        user.setPassword(user.getPassword().trim());

        if (repository.existsByUsername(user.getUsername())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        return repository.save(user.toDTO()).getId();
    }

    @PostMapping
    public void update(User user) {
        repository.save(user.toDTO());
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable int id) {
        repository.deleteById(id);
    }

    @PostMapping("login")
    public User login(String username, String password) {
        UserDTO user = repository.findUserByUsername(username);
        if (user != null && Objects.equals(user.getPassword(), password)) {
            return new User(user);
        }
        throw new HttpClientErrorException(HttpStatus.FORBIDDEN);
    }
}
