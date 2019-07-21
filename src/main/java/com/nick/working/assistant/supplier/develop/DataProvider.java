package com.nick.working.assistant.supplier.develop;

import com.nick.working.assistant.supplier.develop.controllers.UserController;
import com.nick.working.assistant.supplier.develop.dto.ProgressDTO;
import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import com.nick.working.assistant.supplier.develop.models.Progress;
import com.nick.working.assistant.supplier.develop.models.Task;
import com.nick.working.assistant.supplier.develop.models.User;
import com.nick.working.assistant.supplier.develop.repositories.ProgressRepository;
import com.nick.working.assistant.supplier.develop.repositories.TaskRepository;
import com.nick.working.assistant.supplier.develop.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataProvider implements CommandLineRunner {

    private final UserController userController;

    @Autowired
    public DataProvider(UserController userController) {
        this.userController = userController;
    }

    @Override
    public void run(String... args) {
        User user = userController.findUserByName("admin");
        if (user == null) {
            user = new User();
            user.setId(1);
            user.setName("admin");
            user.setPassword("admin");
            user.setManager(true);
            userController.add(user);
        }
    }
}
