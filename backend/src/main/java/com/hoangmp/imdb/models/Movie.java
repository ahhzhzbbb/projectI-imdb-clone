package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String trailerUrl;

    private Boolean tvSeries;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Season> seasons;

    @OneToOne
    private Director director;

    @OneToMany(mappedBy = "movie")
    private List<MovieActor> movieActors;

}
