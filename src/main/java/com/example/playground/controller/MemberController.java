package com.example.playground.controller;

import com.example.playground.MailDto;
import com.example.playground.MemberService;
import com.example.playground.domain.Member;
import com.example.playground.join.MemberLoginRequestDTO;
import com.example.playground.signup.MemberRequestDto;
import com.example.playground.signup.MemberSignupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberSignupService memberSignupService;

    /**
     * 핵심 로직 아님.
     */
    @GetMapping("/api/join")
    public String join() {
        return "/members/register";
    }

    /**
     * 핵심 로직 아님.
     */
    @PostMapping("/api/register")
    public String  registerMember(@ModelAttribute MemberRequestDto requestDto) {
        memberSignupService.registerMember(requestDto.getName(),
                                           requestDto.getPassword(),
                                           requestDto.getEmail(),
                                           requestDto.getNickname());

        return "/members/home";
    }

    /**
     * 핵심 로직 아님.
     */
    @PostMapping("/login")
    public String login(MemberLoginRequestDTO MemberLoginRequestDTO, Model model) {
        Optional<Member> member = memberService.loginMember(MemberLoginRequestDTO.getName(), MemberLoginRequestDTO.getPassword());

        if (member.isEmpty()) {
            model.addAttribute("loginMessage", "아이디 혹은 비밀번호가 일치하지 않습니다.");
            return "/home";
        }
        member.map(Member::getName).ifPresent(memberName -> model.addAttribute("memberName", memberName));
        return "/members/login";
    }

    /**
     * 핵심 로직 아님.
     */
    @GetMapping("/")
    public String home() {
        return "/members/home";
    }

    @GetMapping("/pwPage")
    public String pwPage() {
        return "/members/pw";
    }

    // Email과 name의 일치여부를 check하는 컨트롤러
    @ResponseBody
    @GetMapping("/check/findPw")
    public Map<String, Boolean> pwFind(String userEmail, String userName) {
        Map<String, Boolean> json = new HashMap<>();

        // 이메일과 이름이 일치하는 사용자가 있는지 확인.
        boolean pwFindCheck = memberService.userEmailCheck(userEmail, userName);

        System.out.println(pwFindCheck);
        json.put("check", pwFindCheck);

        return json;
    }

    // 등록된 이메일로 임시비밀번호를 발송하고, 발송된 임시비밀번호로 사용자의 pw를 변경하는 API
    @PostMapping("/check/findPw/sendEmail")
    public void sendEmail(String userEmail, String userName) {
        System.out.println("비밀번호 변경 메서드 호출");
        MailDto dto = memberService.createMailAndChangePassword(userEmail, userName);
        memberService.mailSend(dto);
    }
}
