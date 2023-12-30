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
    // private final BCryptPasswordEncoder encoder; //비밀번호암호화

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

    /**
     * 시작
     */

    public void updateMember(Member member) {
        Member foundMember = memberRepository.findById(member.getId())
                .orElseThrow(() -> { return new IllegalArgumentException("회원 찾기 실패");
        });

        String password = member.getPassword();
        // String encPassword = encoder.encode(rawPassword); //시큐리티

        foundMember.updatePassword(password);
        foundMember.updateEmail(member.getEmail());
        foundMember.updateNickname(member.getNickname());
    }
}