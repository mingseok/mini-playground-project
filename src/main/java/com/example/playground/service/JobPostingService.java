package com.example.playground.service;

import com.example.playground.domain.JobPosting;
import com.example.playground.dto.JobPostingDto;
import com.example.playground.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {
    private final JobPostingRepository jobPostingRepository;

    public List<JobPostingDto> getAllJobPostings() {
        return jobPostingRepository.findAll().stream()
                .map(job -> JobPostingDto.fromEntity(job, 1024))
                .collect(Collectors.toList());
    }

    public JobPostingDto increaseClickCount(Long id, int baseWidth) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job Posting not found: " + id));

        jobPosting.incrementClickCount();
        jobPostingRepository.save(jobPosting);

        return JobPostingDto.fromEntity(jobPosting, baseWidth);
    }
}
