package com.example.playground.controller;

import com.example.playground.MailDto;
import com.example.playground.MemberService;
import com.example.playground.signup.MemberRequestDto;
import com.example.playground.signup.MemberSignupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberSignupService memberSignupService;

    // 회원가입 로직
    @GetMapping("/api/join")
    public String join() {
        return "/members/register";
    }

    // 회원가입 로직
    @PostMapping("/api/register")
    public String  registerMember(@ModelAttribute MemberRequestDto requestDto) {
        memberSignupService.registerMember(requestDto.getName(),
                                           requestDto.getPassword(),
                                           requestDto.getEmail(),
                                           requestDto.getNickname());

        return "/members/home";
    }

    @GetMapping("/")
    public String home() {
        return "/members/home";
    }

    @GetMapping("/pwPage")
    public String pwPage() {
        System.out.println("여기까지 왔어?");
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
