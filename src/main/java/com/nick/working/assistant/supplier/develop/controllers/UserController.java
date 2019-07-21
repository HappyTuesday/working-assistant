package com.nick.working.assistant.supplier.develop.controllers;

import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import com.nick.working.assistant.supplier.develop.models.LoginResult;
import com.nick.working.assistant.supplier.develop.models.LoginTicketInfo;
import com.nick.working.assistant.supplier.develop.models.User;
import com.nick.working.assistant.supplier.develop.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@RestController
@RequestMapping("/api/supplier/develop/users")
public class UserController {
    private final UserRepository repository;
    private final String encryptionPassword;
    private final String passwordSha1Salt;

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserRepository repository,
                          @Value("${login.ticket.encryption.password}") String encryptionPassword,
                          @Value("${login.password.sha1.salt}") String passwordSha1Salt) {

        this.repository = repository;
        this.encryptionPassword = encryptionPassword;
        this.passwordSha1Salt = passwordSha1Salt;
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
        if (user.getName() == null || user.getName().isEmpty()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        user.setName(user.getName().trim());
        user.setPassword(digestPassword(user.getPassword().trim()));

        if (repository.existsByName(user.getName())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        return repository.save(user.toDTO()).getId();
    }

    @PostMapping
    public void update(User user) {
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        Optional<UserDTO> optionalUserDTO = repository.findById(user.getId());
        if (!optionalUserDTO.isPresent()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }
        UserDTO dto = optionalUserDTO.get();
        if (!Objects.equals(user.getName(), dto.getName())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        dto.setPassword(digestPassword(user.getPassword().trim()));
        dto.setManager(user.isManager());
        repository.save(dto);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable int id) {
        repository.deleteById(id);
    }

    private String digestPassword(String originPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            String saltedPassword = originPassword + passwordSha1Salt;
            byte[] digested = digest.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(digested);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private LoginResult generateLoginResult(UserDTO userDTO) {
        User user = new User(userDTO);

        LoginTicketInfo ticketInfo = new LoginTicketInfo();
        ticketInfo.setUserId(user.getId());
        ticketInfo.setVersion(1);
        ticketInfo.setExpire(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
        String ticket = ticketInfo.toTicket(encryptionPassword);

        LoginResult result = new LoginResult();
        result.setUser(user);
        result.setTicket(ticket);

        return result;
    }

    public User findUserByName(String name) {
        UserDTO userDTO = repository.findUserByName(name);
        if (userDTO == null) {
            return null;
        }
        return new User(userDTO);
    }

    @PostMapping("login")
    public LoginResult login(String name, String password) {
        UserDTO userDTO = repository.findUserByName(name);
        if (userDTO == null || !Objects.equals(userDTO.getPassword(), digestPassword(password))) {
            return null;
        }

        return generateLoginResult(userDTO);
    }

    @PostMapping("login/ticket")
    public LoginResult loginByTicket(String ticket) {
        LoginTicketInfo info = LoginTicketInfo.fromTicket(encryptionPassword, ticket);
        if (info == null) {
            return null;
        }

        if (info.getVersion() != 1) {
            LOGGER.debug("invalid login ticket version {} in ticket {}", info.getVersion(), ticket);
            return null;
        }

        if (info.getExpire() < new Date().getTime()) {
            LOGGER.debug("login ticket expired with expire time {} in ticket {}", info.getExpire(), ticket);
            return null;
        }

        Optional<UserDTO> optionalUserDTO = repository.findById(info.getUserId());
        if (!optionalUserDTO.isPresent()) {
            LOGGER.debug("login ticket contains invalid user id {} in ticket {}", info.getUserId(), ticket);
            return null;
        }

        return generateLoginResult(optionalUserDTO.get());
    }
}
