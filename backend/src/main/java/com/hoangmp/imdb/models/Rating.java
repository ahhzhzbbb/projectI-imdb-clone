package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

/*
    * Model Rating được sử dụng để lưu trữ thông tin về đánh giá của người dùng cho các tập phim.
 */
@Entity
@Table(
        name = "ratings",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "episode_id"}
        )
)
@Getter
@Setter
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(10)
    private Integer score;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "episode_id")
    private Episode episode;
}
