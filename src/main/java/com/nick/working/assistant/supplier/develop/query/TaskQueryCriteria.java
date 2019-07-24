package com.nick.working.assistant.supplier.develop.query;

import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import com.nick.working.assistant.supplier.develop.models.TaskStatus;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class TaskQueryCriteria {
    TaskStatus taskStatus;
    String owner;
    Long startTransitTime;
    Long endTransitTime;
    String searchKey;

    public Specification<TaskDTO> toWhereClause() {
        List<Specification<TaskDTO>> clauses = new ArrayList<>();
        if (taskStatus != null) {
            clauses.add((t, cq, cb) -> cb.equal(t.get("taskStatus"), taskStatus.name()));
        }
        if (owner != null) {
            clauses.add((t, cq, cb) -> cb.equal(t.get("owner").get("name"), owner));
        }
        if (startTransitTime != null) {
            clauses.add((t, cq, cb) -> cb.greaterThanOrEqualTo(t.get("transitTime"), new Date(startTransitTime)));
        }
        if (endTransitTime != null) {
            clauses.add((t, cq, cb) -> cb.lessThan(t.get("transitTime"), new Date(endTransitTime)));
        }
        if (searchKey != null) {
            clauses.add((t, cq, cb) -> cb.or(
                cb.like(t.get("supplierName"), "%" + searchKey + "%"),
                cb.like(t.get("supplierType"), searchKey),
                cb.like(t.get("type"), searchKey),
                cb.like(t.get("subtype"), searchKey),
                cb.like(t.get("description"), "%" + searchKey + "%")
            ));
        }

        return clauses.stream().reduce((x, a) -> a.and(x)).orElse(null);
    }
}
