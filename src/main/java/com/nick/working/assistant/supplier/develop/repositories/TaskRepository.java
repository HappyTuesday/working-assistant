package com.nick.working.assistant.supplier.develop.repositories;

import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import com.nick.working.assistant.supplier.develop.models.Task;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.xml.crypto.Data;
import java.util.Date;
import java.util.List;

public interface TaskRepository extends PagingAndSortingRepository<TaskDTO, Integer>, JpaSpecificationExecutor<TaskDTO> {
    Iterable<TaskDTO> findAllByDone(boolean done);

    Iterable<TaskDTO> findAllByOwnerName(String owner);

    Iterable<TaskDTO> findAllByOwnerNameAndDone(String owner, boolean done);
}
