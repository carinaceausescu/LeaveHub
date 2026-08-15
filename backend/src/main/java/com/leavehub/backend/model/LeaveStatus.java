package com.leavehub.backend.model;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

public enum LeaveStatus {

    DRAFT,
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED;

    public static LeaveStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Statusul cererii este obligatoriu");
        }
        return Arrays.stream(values())
                .filter(status -> status.name().equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Status invalid: " + value + ". Valori permise: " + List.of(values())));
    }

    public Set<LeaveStatus> allowedTransitions() {
        return switch (this) {
            case DRAFT -> Set.of(PENDING, CANCELLED);
            case PENDING -> Set.of(APPROVED, REJECTED, CANCELLED);
            case APPROVED -> Set.of(CANCELLED);
            case REJECTED, CANCELLED -> Set.of();
        };
    }

    public boolean isFinal() {
        return allowedTransitions().isEmpty();
    }
}
