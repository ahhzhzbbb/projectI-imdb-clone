package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue
    private Long id;

    @Min(1)
    @Max(10)
    private Integer score;

    @Column(nullable = false)
    private String content;

    private LocalDate createAt = LocalDate.now();

    private String comment;

    @ManyToOne
    @JoinColumn()
    private User user;
}
