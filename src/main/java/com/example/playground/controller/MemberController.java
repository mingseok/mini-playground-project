package com.example.playground.controller;

import com.example.playground.domain.Member;
import com.example.playground.edit.MemberEditResponseDTO;
import com.example.playground.join_login.MemberLoginRequestDTO;
import com.example.playground.join_login.MemberRequestDto;
import com.example.playground.join_login.MemberService;
import com.example.playground.join_login.MemberSignupService;
import com.example.playground.mail.MailDto;
import com.example.playground.mail.MemberMailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Controller
@RequiredArgsConstructor
public class MemberController {

    //24.02.15

    private final MemberService memberService;
    private final MemberSignupService memberSignupService;
    private final MemberMailService memberMailService;

    @GetMapping("/api/join")
    public String join() {
        return "/members/register";
    }

    @PostMapping("/api/register")
    public String  registerMember(@ModelAttribute MemberRequestDto requestDto) {
        memberSignupService.registerMember(requestDto.getName(),
                                           requestDto.getPassword(),
                                           requestDto.getEmail(),
                                           requestDto.getNickname());

        return "/members/home";
    }

    @PostMapping("/login")
    public String login(MemberLoginRequestDTO MemberLoginRequestDTO, HttpSession session, Model model) {
        Optional<Member> member = memberService.loginMember(MemberLoginRequestDTO.getName(), MemberLoginRequestDTO.getPassword());

        if (member.isEmpty()) {
            model.addAttribute("loginMessage", "아이디 혹은 비밀번호가 일치하지 않습니다.");
            return "/home";
        }

        session.setAttribute("member", member.get());
        member.map(Member::getName).ifPresent(memberName -> model.addAttribute("memberName", memberName));
        return "/members/login";
    }

    @GetMapping("/")
    public String home() {
        return "/members/home";
    }

    @GetMapping("/pwPage")
    public String pwPage() {
        return "/members/pw";
    }

    @ResponseBody
    @GetMapping("/check/findPw")
    public Map<String, Boolean> pwFind(String userEmail, String userName) {
        Map<String, Boolean> json = new HashMap<>();

        boolean pwFindCheck = memberService.userEmailCheck(userEmail, userName);

        json.put("check", pwFindCheck);
        return json;
    }

    @PostMapping("/check/findPw/sendEmail")
    public void sendEmail(String userEmail, String userName) {
        System.out.println("비밀번호 변경 메서드 호출");
        MailDto dto = memberMailService.createMailAndChangePassword(userEmail, userName);
        memberMailService.mailSend(dto);
    }

    /**
     * 시작
     */

    @GetMapping("/mypage")
    public String myPage(HttpSession session, Model model) {
        Member member = (Member) session.getAttribute("member");

        if (member == null) {
            return "redirect:/login";
        }

        // 로그를 출력하여 member 객체의 값을 확인
        System.out.println("Member ID: " + member.getId());
        System.out.println("Member Name: " + member.getName());
        System.out.println("Member Email: " + member.getEmail());
        System.out.println("Member Nickname: " + member.getNickname());


        model.addAttribute("member", member);
        return "/members/mypage";
    }

    @ResponseBody
    @PutMapping("/edit")
    public MemberEditResponseDTO memberUpdate(@RequestBody Member member) {
        memberService.updateMember(member);
        return new MemberEditResponseDTO(HttpStatus.OK.value());
    }

}
