package com.nick.working.assistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class WorkingAssistantApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkingAssistantApplication.class, args);
	}

}
