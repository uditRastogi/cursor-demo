package com.example.backend.config;

import com.example.backend.model.Task;
import com.example.backend.model.TaskStatus;
import com.example.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(TaskRepository taskRepository) {
        return args -> {
            Task task1 = new Task();
            task1.setTitle("Implement User Authentication");
            task1.setDescription("Add user login and registration functionality");
            task1.setCompleted(false);
            task1.setType("Feature");
            task1.setStatus(TaskStatus.IN_PROGRESS);
            task1.setAssignees(Arrays.asList("john.doe", "jane.smith"));
            task1.setProgress(30);
            task1.setComments(2);
            task1.setSubtasks(3);

            Task task2 = new Task();
            task2.setTitle("Fix Navigation Bug");
            task2.setDescription("Resolve the navigation menu disappearing on mobile devices");
            task2.setCompleted(false);
            task2.setType("Bug");
            task2.setStatus(TaskStatus.TODO);
            task2.setAssignees(Arrays.asList("bob.wilson"));
            task2.setProgress(0);
            task2.setComments(1);
            task2.setSubtasks(0);

            Task task3 = new Task();
            task3.setTitle("Update Documentation");
            task3.setDescription("Update API documentation with new endpoints");
            task3.setCompleted(true);
            task3.setType("Documentation");
            task3.setStatus(TaskStatus.DONE);
            task3.setAssignees(Arrays.asList("alice.johnson"));
            task3.setProgress(100);
            task3.setComments(4);
            task3.setSubtasks(2);

            taskRepository.saveAll(Arrays.asList(task1, task2, task3));
        };
    }
} 