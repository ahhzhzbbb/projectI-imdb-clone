package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "reviews",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "movie_id"}
        )
)
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue
    private Long id;

    @Min(1)
    @Max(10)
    private Integer score;

    private Boolean isSpoiler = false;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDate createdAt = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
}
