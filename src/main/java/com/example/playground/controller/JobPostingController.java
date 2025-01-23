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

    @GetMapping("/")
    public String showJobPostings(Model model) {
        model.addAttribute("jobPostings", jobPostingService.getAllJobPostings());
        return "index";
    }

    @PostMapping("/api/job-postings/{id}/click")
    public ResponseEntity<JobPostingDto> increaseClickCount(@PathVariable("id") Long id) {
        int baseWidth = 1024; // 기준 화면 너비
        JobPostingDto updatedPosting = jobPostingService.increaseClickCount(id, baseWidth);
        return ResponseEntity.ok(updatedPosting);
    }
}
