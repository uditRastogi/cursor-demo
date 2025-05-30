package com.example.backend.repository;

import com.example.backend.model.Task;
import com.example.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByType(String type);
    List<Task> findByAssigneesContaining(String assignee);
} 