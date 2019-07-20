package com.nick.working.assistant.supplier.develop;

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

    private final TaskRepository taskRepository;
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    @Autowired
    public DataProvider(TaskRepository taskRepository, ProgressRepository progressRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        UserDTO u = new UserDTO();
        u.setUsername("nick");
        u.setPassword("nick");
        u.setManager(true);
        this.userRepository.save(u);

        TaskDTO t = new TaskDTO();
        t.setId(1);
        t.setOwner("nick");
        t.setCompany("google");
        t.setType("buy");
        t.setSubtype("buy-computer");
        t.setDesc("buy something");
        this.taskRepository.save(t);

        ProgressDTO p = new ProgressDTO();
        p.setId(1);
        p.setTaskId(2);
        p.setComment("payed");
        p.setContent("payed");
        p.setAuthor("nick");
        p.setTimestamp(new Date());
        this.progressRepository.save(p);
    }
}
