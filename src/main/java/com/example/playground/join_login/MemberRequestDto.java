package com.example.playground.join_login;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberRequestDto {

    // 24.01.15
    
    private String name;
    private String password;
    private String email;
    private String nickname;
}
