package com.example.backend.controller;

import com.example.backend.model.Task;
import com.example.backend.model.TaskStatus;
import com.example.backend.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        logger.info("Fetching all tasks");
        List<Task> tasks = taskRepository.findAll();
        logger.info("Found {} tasks", tasks.size());
        tasks.forEach(task -> logger.debug("Task: {}", task));
        return tasks;
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TODO);
        }
        return taskRepository.save(task);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setTitle(taskDetails.getTitle());
                task.setDescription(taskDetails.getDescription());
                task.setCompleted(taskDetails.isCompleted());
                task.setType(taskDetails.getType());
                task.setStatus(taskDetails.getStatus());
                task.setAssignees(taskDetails.getAssignees());
                task.setProgress(taskDetails.getProgress());
                task.setComments(taskDetails.getComments());
                task.setSubtasks(taskDetails.getSubtasks());
                return ResponseEntity.ok(taskRepository.save(task));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        return taskRepository.findById(id)
            .map(task -> {
                taskRepository.delete(task);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setStatus(status);
                return ResponseEntity.ok(taskRepository.save(task));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<Task> updateTaskProgress(@PathVariable Long id, @RequestParam int progress) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setProgress(progress);
                return ResponseEntity.ok(taskRepository.save(task));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    @GetMapping("/type/{type}")
    public List<Task> getTasksByType(@PathVariable String type) {
        return taskRepository.findByType(type);
    }
} 