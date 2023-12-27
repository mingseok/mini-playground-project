package com.example.playground.join;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 핵심 클래스 아님
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberLoginRequestDTO {

    private String name;
    private String password;
}