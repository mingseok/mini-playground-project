package com.example.playground.join_login;

import com.example.playground.domain.Member;
import com.example.playground.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberSignupService {

    private final MemberRepository memberRepository;

    public Member registerMember(String name, String password, String email, String nickname) {
        Member member = Member.builder()
                .name(name)
                .password(password)
                .email(email)
                .nickname(nickname)
                .build();

        return memberRepository.save(member);
    }
}
