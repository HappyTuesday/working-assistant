package com.nick.working.assistant.supplier.develop.repositories;

import com.nick.working.assistant.supplier.develop.dto.ProgressDTO;
import com.nick.working.assistant.supplier.develop.models.Progress;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ProgressRepository extends PagingAndSortingRepository<ProgressDTO, Integer> {
    List<ProgressDTO> findAllByTaskIdOrderByTimestampDesc(int taskId);
}
