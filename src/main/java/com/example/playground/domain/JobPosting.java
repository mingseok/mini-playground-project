package com.example.playground.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;
    private String description;
    private int clickCount;

    public JobPosting(String title, String company, String location, String description) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.clickCount = 0; // 초기 클릭 수는 0
    }

    public void incrementClickCount() {
        this.clickCount += 1;
    }

    public int[] getAdjustedSize(int baseWidth) {
        int minSize = calculateMinSize(baseWidth);
        int maxSize = calculateMaxSize(baseWidth);

        int size = calculateSize(minSize, maxSize);

        return determineDimensions(size, minSize);
    }

    private int calculateMinSize(int baseWidth) {
        return baseWidth / 32; // 최소 크기
    }

    private int calculateMaxSize(int baseWidth) {
        return baseWidth / 4; // 최대 크기
    }

    private int calculateSize(int minSize, int maxSize) {
        // 클릭 수에 따른 크기 계산 (2^n 형태로 증가)
        return (int) Math.min(maxSize, minSize * Math.pow(2, clickCount));
    }

    private int[] determineDimensions(int size, int minSize) {
        // 가로와 세로 크기 번갈아 증가
        boolean isWidthIncreased = clickCount % 2 == 0;

        int width = size;
        int height = minSize;

        if (!isWidthIncreased) {
            width = minSize;
            height = size;
        }

        return new int[]{width, height};
    }

}
