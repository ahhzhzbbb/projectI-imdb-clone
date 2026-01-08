package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.*;

/*
    * Model Director được sử dụng để lưu trữ thông tin về đạo diễn trong hệ thống.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Director {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(length = 500)
    private String imageUrl;

    @OneToOne
    private Movie movie;
}

