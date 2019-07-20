package com.nick.working.assistant.supplier.develop.repositories;

import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface UserRepository extends PagingAndSortingRepository<UserDTO, Integer> {
    UserDTO findUserByUsername(String username);

    boolean existsByUsername(String username);
}
