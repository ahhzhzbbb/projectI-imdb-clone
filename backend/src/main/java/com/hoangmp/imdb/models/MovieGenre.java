package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "movie_genre",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"movie_id", "genre_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieGenre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;
}

