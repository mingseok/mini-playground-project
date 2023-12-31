package com.example.playground.repository;

import com.example.playground.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {

    @Query("select m from Member m where m.name = :name and m.password = :password")
    Optional<Member> selectMember(@Param("name") String name, @Param("password") String password);

    Optional<Member> findByEmail(String email);

    @Modifying
    @Query("update Member m set m.password = :password where m.id = :id")
    void updatePasswordById(@Param("id") Long id, @Param("password") String password);

}