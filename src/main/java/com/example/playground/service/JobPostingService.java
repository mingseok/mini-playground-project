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
                .map(job -> JobPostingDto.fromEntity(job, 1024)) // clickCount 포함
                .collect(Collectors.toList());
    }

    public JobPostingDto getJobPostingById(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job Posting not found: " + id));
        return JobPostingDto.fromEntity(jobPosting, 1024);
    }

    public JobPostingDto increaseClickCount(Long id, int baseWidth) {
        try {
            JobPosting jobPosting = jobPostingRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Job Posting not found: " + id));

            jobPosting.incrementClickCount();
            jobPostingRepository.save(jobPosting);

            return JobPostingDto.fromEntity(jobPosting, baseWidth);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Job Posting not found: " + id, e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update click count for Job Posting ID: " + id, e);
        }
    }

    public JobPostingDto createJobPosting(JobPostingDto jobPostingDto) {
        JobPosting jobPosting = new JobPosting(
                jobPostingDto.getTitle(),
                jobPostingDto.getCompany(),
                jobPostingDto.getLocation(),
                jobPostingDto.getDescription()
        );
        jobPosting = jobPostingRepository.save(jobPosting);
        return JobPostingDto.fromEntity(jobPosting, 1024);
    }

    public JobPostingDto updateJobPosting(Long id, JobPostingDto jobPostingDto) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job Posting not found: " + id));

        jobPosting.updateTitle(jobPostingDto.getTitle());
        jobPosting.updateCompany(jobPostingDto.getCompany());
        jobPosting.updateLocation(jobPostingDto.getLocation());
        jobPosting.updateDescription(jobPostingDto.getDescription());

        jobPosting = jobPostingRepository.save(jobPosting);
        return JobPostingDto.fromEntity(jobPosting, 1024);
    }

    public void deleteJobPosting(Long id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new IllegalArgumentException("Job Posting not found: " + id);
        }
        jobPostingRepository.deleteById(id);
    }
}