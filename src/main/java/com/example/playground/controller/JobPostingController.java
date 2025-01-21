package com.example.playground.controller;

import com.example.playground.dto.JobPostingDto;
import com.example.playground.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-postings")
@RequiredArgsConstructor
public class JobPostingController {
    private final JobPostingService jobPostingService;

    // 채용 공고 목록 조회 (GET /api/job-postings)
    @GetMapping
    public ResponseEntity<List<JobPostingDto>> getAllJobPostings() {
        List<JobPostingDto> jobPostings = jobPostingService.getAllJobPostings();
        return ResponseEntity.ok(jobPostings);
    }

    // 특정 채용 공고 조회 (GET /api/job-postings/{id})
    @GetMapping("/{id}")
    public ResponseEntity<JobPostingDto> getJobPostingById(@PathVariable Long id) {
        JobPostingDto jobPosting = jobPostingService.getJobPostingById(id);
        return ResponseEntity.ok(jobPosting);
    }

    // 채용 공고 클릭 수 증가 (POST /api/job-postings/{id}/click)
    @PostMapping("/{id}/click")
    public ResponseEntity<JobPostingDto> increaseClickCount(@PathVariable("id") Long id) {
        int baseWidth = 1024; // 기준 화면 너비 (예: 1024px)
        JobPostingDto updatedPosting = jobPostingService.increaseClickCount(id, baseWidth);
        return ResponseEntity.ok(updatedPosting);
    }

    // 채용 공고 생성 (POST /api/job-postings)
    @PostMapping
    public ResponseEntity<JobPostingDto> createJobPosting(@RequestBody JobPostingDto jobPostingDto) {
        JobPostingDto createdJobPosting = jobPostingService.createJobPosting(jobPostingDto);
        return ResponseEntity.status(201).body(createdJobPosting); // HTTP 201 Created
    }

    // 채용 공고 수정 (PUT /api/job-postings/{id})
    @PutMapping("/{id}")
    public ResponseEntity<JobPostingDto> updateJobPosting(
            @PathVariable Long id,
            @RequestBody JobPostingDto jobPostingDto
    ) {
        JobPostingDto updatedJobPosting = jobPostingService.updateJobPosting(id, jobPostingDto);
        return ResponseEntity.ok(updatedJobPosting);
    }

    // 채용 공고 삭제 (DELETE /api/job-postings/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPosting(@PathVariable Long id) {
        jobPostingService.deleteJobPosting(id);
        return ResponseEntity.noContent().build(); // HTTP 204 No Content
    }
}