package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Episode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer episodeNumber;

    @Column(length = 200)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 500)
    private String posterURL;

    @Column(length = 500)
    private String trailerURL;

    @ManyToOne
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @Column(nullable = false)
    private Double averageScore = 0.0;

    @Column(nullable = false)
    private Integer ratingCount = 0;

    @OneToMany(
            mappedBy = "episode",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Set<Rating> ratings = new HashSet<>();
}

