package com.nick.working.assistant.supplier.develop.repositories;

import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import com.nick.working.assistant.supplier.develop.models.Task;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface TaskRepository extends PagingAndSortingRepository<TaskDTO, Integer> {
    Iterable<TaskDTO> findAllByDone(boolean done);

    Iterable<TaskDTO> findAllByOwnerName(String owner);

    Iterable<TaskDTO> findAllByOwnerNameAndDone(String owner, boolean done);
}
