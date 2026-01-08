package com.hoangmp.imdb.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/*
    * Model Genre được sử dụng để lưu trữ thông tin về thể loại phim trong hệ thống.
 */
@Entity
@Table(
        name = "genres",
        uniqueConstraints = @UniqueConstraint(columnNames = "name")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(
            mappedBy = "genre",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private Set<MovieGenre> movieGenres = new HashSet<>();
}

