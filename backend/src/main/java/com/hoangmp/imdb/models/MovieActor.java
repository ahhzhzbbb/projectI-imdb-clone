package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.*;

/*
    * Model MovieActor được sử dụng để lưu trữ thông tin về mối quan hệ giữa phim và diễn viên, bao gồm vai diễn của diễn viên trong phim.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MovieActor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "actor_id")
    private Actor actor;

    private String roleName;
}
