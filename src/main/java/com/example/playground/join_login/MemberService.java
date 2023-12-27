package com.example.playground.join_login;

import com.example.playground.domain.Member;
import com.example.playground.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public boolean userEmailCheck(String userEmail, String userName) {
        Optional<Member> member = memberRepository.findByEmail(userEmail);

        if (member.isPresent() && member.get().getName().equals(userName)) {
            return true;
        } else {
            return false;
        }
    }

    public Optional<Member> loginMember(String name, String password) {
        Optional<Member> member = memberRepository.selectMember(name, password);
        return member;
    }

}