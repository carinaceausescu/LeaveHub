package com.leavehub.backend.repository;

import com.leavehub.backend.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {

    @Query("SELECT lr FROM LeaveRequest lr WHERE " +
            "(:status IS NULL OR lr.status = :status) AND " +
            "(:departmentId IS NULL OR lr.employee.department.deptId = :departmentId) AND " +
            "(:leaveTypeId IS NULL OR lr.leaveType.leaveTypeId = :leaveTypeId) AND " +
            "(:employeeId IS NULL OR lr.employee.emplId = :employeeId) AND " +
            "(:startDate IS NULL OR lr.endDate >= :startDate) AND " +
            "(:endDate IS NULL OR lr.startDate <= :endDate)")
    List<LeaveRequest> search(
            @Param("status") String status,
            @Param("departmentId") Integer departmentId,
            @Param("leaveTypeId") Integer leaveTypeId,
            @Param("employeeId") Integer employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE " +
            "lr.employee.department.deptId = :departmentId AND " +
            "lr.status = 'APPROVED' AND " +
            "lr.leaveRequestId <> :excludeRequestId AND " +
            "lr.startDate <= :endDate AND lr.endDate >= :startDate")
    long countOverlappingApproved(
            @Param("departmentId") Integer departmentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("excludeRequestId") Integer excludeRequestId
    );
}