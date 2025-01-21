package com.example.playground.controller.publicController;

import com.example.playground.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/") // REST API 경로와 분리
@RequiredArgsConstructor
public class ShowJobPostingController {

    private final JobPostingService jobPostingService;

    // 페이지 이동을 위한 메서드
    @GetMapping
    public String showJobPostings(Model model) {
        model.addAttribute("jobPostings", jobPostingService.getAllJobPostings());
        return "index"; // 템플릿 엔진 파일을 반환
    }
}