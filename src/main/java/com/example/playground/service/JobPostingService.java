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
                .map(JobPostingDto::fromEntity)
                .collect(Collectors.toList());
    }

    public JobPostingDto increaseClickCount(Long id) {
        System.out.println("increaseClickCount 호출됨. ID: " + id); // 로그 추가
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("채용 공고를 찾을 수 없음: " + id));

        jobPosting.incrementClickCount();
        jobPostingRepository.save(jobPosting);

        return JobPostingDto.fromEntity(jobPosting);
    }
}