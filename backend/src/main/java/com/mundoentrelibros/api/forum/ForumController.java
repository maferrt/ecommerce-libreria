package com.mundoentrelibros.api.forum;

import com.mundoentrelibros.api.forum.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forums")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;

    @GetMapping
    public ResponseEntity<List<ForumResponse>> getForums(Authentication authentication) {
        List<ForumResponse> response = forumService.getForums(authentication.getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{forumSlug}")
    public ResponseEntity<ForumResponse> getForumBySlug(
            Authentication authentication,
            @PathVariable String forumSlug
    ) {
        ForumResponse response = forumService.getForumBySlug(
                authentication.getName(),
                forumSlug
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{forumSlug}/subscribe")
    public ResponseEntity<ForumResponse> subscribe(
            Authentication authentication,
            @PathVariable String forumSlug
    ) {
        ForumResponse response = forumService.subscribe(
                authentication.getName(),
                forumSlug
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{forumSlug}/subscribe")
    public ResponseEntity<ForumResponse> unsubscribe(
            Authentication authentication,
            @PathVariable String forumSlug
    ) {
        ForumResponse response = forumService.unsubscribe(
                authentication.getName(),
                forumSlug
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{forumSlug}/posts")
    public ResponseEntity<List<ForumPostResponse>> getPosts(
            Authentication authentication,
            @PathVariable String forumSlug
    ) {
        List<ForumPostResponse> response = forumService.getPosts(
                authentication.getName(),
                forumSlug
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{forumSlug}/posts")
    public ResponseEntity<ForumPostResponse> createPost(
            Authentication authentication,
            @PathVariable String forumSlug,
            @Valid @RequestBody ForumPostRequest request
    ) {
        ForumPostResponse response = forumService.createPost(
                authentication.getName(),
                forumSlug,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<ForumPostDetailResponse> getPostDetail(
            Authentication authentication,
            @PathVariable Long postId
    ) {
        ForumPostDetailResponse response = forumService.getPostDetail(
                authentication.getName(),
                postId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/posts/{postId}/replies")
    public ResponseEntity<ForumReplyResponse> createReply(
            Authentication authentication,
            @PathVariable Long postId,
            @Valid @RequestBody ForumReplyRequest request
    ) {
        ForumReplyResponse response = forumService.createReply(
                authentication.getName(),
                postId,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(
            Authentication authentication,
            @PathVariable Long postId
    ) {
        forumService.deletePost(authentication.getName(), postId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<Void> deleteReply(
            Authentication authentication,
            @PathVariable Long replyId
    ) {
        forumService.deleteReply(authentication.getName(), replyId);

        return ResponseEntity.noContent().build();
    }
}