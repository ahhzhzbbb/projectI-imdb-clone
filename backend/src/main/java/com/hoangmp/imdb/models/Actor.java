package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/*
    * Model Actor được sử dụng để lưu trữ thông tin về diễn viên trong hệ thống.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(length = 500)
    private String imageUrl;

    @OneToMany(
            mappedBy = "actor",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<MovieActor> movieActors;
}
