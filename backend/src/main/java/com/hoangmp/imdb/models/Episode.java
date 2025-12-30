package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
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
}

