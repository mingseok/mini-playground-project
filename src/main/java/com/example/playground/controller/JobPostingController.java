package com.example.playground.controller;

import com.example.playground.dto.JobPostingDto;
import com.example.playground.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class JobPostingController {
    private final JobPostingService jobPostingService;

    // 페이지 이동을 위한 메서드
    @GetMapping("/")
    public String showJobPostings(Model model) {
        model.addAttribute("jobPostings", jobPostingService.getAllJobPostings());
        return "index";
    }

    // 채용 공고 클릭 수 증가 (POST /api/job-postings/{id}/click)
    @PostMapping("/api/job-postings/{id}/click")
    public ResponseEntity<JobPostingDto> increaseClickCount(@PathVariable("id") Long id) {
        int baseWidth = 1024; // 기준 화면 너비 (예: 1024px)
        JobPostingDto updatedPosting = jobPostingService.increaseClickCount(id, baseWidth);
        return ResponseEntity.ok(updatedPosting);
    }
}
