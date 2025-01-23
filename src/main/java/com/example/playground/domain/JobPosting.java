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

    public void incrementClickCount() {
        this.clickCount++;
    }

    public int[] getAdjustedSize(int baseWidth) {
        int step = 5;
        int minSize = 150;
        int sizeIncrement = 50;
        int maxSize = 400;

        int stepLevel = Math.floorDiv(clickCount, step);
        int size = Math.min(maxSize, minSize + stepLevel * sizeIncrement);

        return new int[]{size, (int) (size * 0.75)};
    }
}
