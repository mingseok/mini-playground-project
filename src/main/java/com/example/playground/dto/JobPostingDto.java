package com.example.playground.dto;

import com.example.playground.domain.JobPosting;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JobPostingDto {
    private final Long id;
    private final String title;
    private final String company;
    private final String location;
    private final String description;
    private final int width;
    private final int height;
    private final int clickCount; // 추가

    // 생성자 업데이트

    public JobPostingDto(Long id, String title, String company, String location, String description, int width, int height, int clickCount) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.width = width;
        this.height = height;
        this.clickCount = clickCount; // 저장
    }

    public static JobPostingDto fromEntity(JobPosting jobPosting, int baseWidth) {
        int[] size = jobPosting.getAdjustedSize(baseWidth);

        return JobPostingDto.builder()
                .id(jobPosting.getId())
                .title(jobPosting.getTitle())
                .company(jobPosting.getCompany())
                .location(jobPosting.getLocation())
                .description(jobPosting.getDescription())
                .width(size[0])
                .height(size[1])
                .clickCount(jobPosting.getClickCount()) // 추가
                .build();
    }
}
