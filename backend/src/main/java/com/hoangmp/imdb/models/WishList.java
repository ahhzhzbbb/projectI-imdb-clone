package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.*;

/*
    * Model WishList được sử dụng để lưu trữ thông tin về danh sách mong muốn (wish list) của người dùng, bao gồm các phim mà người dùng muốn xem sau.
 */
@Entity
@Table(
        name = "wish_lists",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "movie_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WishList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
}
