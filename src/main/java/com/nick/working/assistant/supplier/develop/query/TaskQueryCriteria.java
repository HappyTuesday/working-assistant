package com.nick.working.assistant.supplier.develop.query;

import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class TaskQueryCriteria {
    Boolean done;
    String owner;
    Long startDoneTime;
    Long endDoneTime;
    String key;

    public Specification<TaskDTO> toWhereClause() {
        List<Specification<TaskDTO>> clauses = new ArrayList<>();
        if (done != null) {
            clauses.add((t, cq, cb) -> cb.equal(t.get("done"), done));
        }
        if (owner != null) {
            clauses.add((t, cq, cb) -> cb.equal(t.get("owner.name"), owner));
        }
        if (startDoneTime != null) {
            clauses.add((t, cq, cb) -> cb.greaterThanOrEqualTo(t.get("doneTime"), new Date(startDoneTime)));
        }
        if (endDoneTime != null) {
            clauses.add((t, cq, cb) -> cb.lessThan(t.get("doneTime"), new Date(endDoneTime)));
        }
        if (key != null) {
            clauses.add((t, cq, cb) -> cb.or(
                cb.like(t.get("supplierName"), "%" + key + "%"),
                cb.like(t.get("supplierType"), key),
                cb.like(t.get("type"), key),
                cb.like(t.get("subtype"), key),
                cb.like(t.get("description"), "%" + key + "%")
            ));
        }

        return clauses.stream().reduce((x, a) -> a.and(x)).orElse(null);
    }
}
