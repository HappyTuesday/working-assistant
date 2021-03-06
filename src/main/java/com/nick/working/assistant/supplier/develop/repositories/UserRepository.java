package com.nick.working.assistant.supplier.develop.repositories;

import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface UserRepository extends PagingAndSortingRepository<UserDTO, Integer> {
    UserDTO findUserByName(String name);

    boolean existsByName(String name);
}
