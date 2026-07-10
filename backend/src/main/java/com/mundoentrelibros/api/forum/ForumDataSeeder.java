package com.mundoentrelibros.api.forum;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ForumDataSeeder implements CommandLineRunner {

    private final ForumRepository forumRepository;

    @Override
    public void run(String... args) {
        if (forumRepository.count() > 0) {
            return;
        }

        forumRepository.saveAll(List.of(
                createForum(
                        "novela-juvenil",
                        "Novela Juvenil",
                        "Comparte teorías, recomendaciones y opiniones sobre novelas juveniles.",
                        "/images/forums/novela-juvenil.jpg",
                        1
                ),
                createForum(
                        "fantasia",
                        "Fantasía",
                        "Dragones, magia, mundos imposibles y sagas épicas.",
                        "/images/forums/fantasia.jpg",
                        2
                ),
                createForum(
                        "terror",
                        "Terror",
                        "Historias inquietantes, suspenso y libros para leer con la luz encendida.",
                        "/images/forums/terror.jpg",
                        3
                ),
                createForum(
                        "ciencia-ficcion",
                        "Ciencia Ficción",
                        "Futuros posibles, tecnología, distopías y viajes espaciales.",
                        "/images/forums/ciencia-ficcion.jpg",
                        4
                ),
                createForum(
                        "recomendaciones",
                        "Recomendaciones",
                        "Pide y comparte recomendaciones según gustos, autores o géneros.",
                        "/images/forums/recomendaciones.jpg",
                        5
                )
        ));
    }

    private Forum createForum(
            String slug,
            String name,
            String description,
            String coverImage,
            int displayOrder
    ) {
        return Forum.builder()
                .slug(slug)
                .name(name)
                .description(description)
                .coverImage(coverImage)
                .displayOrder(displayOrder)
                .active(true)
                .build();
    }
}