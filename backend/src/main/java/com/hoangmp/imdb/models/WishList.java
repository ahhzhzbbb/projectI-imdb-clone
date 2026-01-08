package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.*;

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
