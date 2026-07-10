package com.mundoentrelibros.api.forum;

import com.mundoentrelibros.api.forum.dto.*;
import com.mundoentrelibros.api.profile.UserProfile;
import com.mundoentrelibros.api.profile.UserProfileRepository;
import com.mundoentrelibros.api.user.AppUser;
import com.mundoentrelibros.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ForumService {

    private static final int POINTS_BY_POST = 10;
    private static final int POINTS_BY_REPLY = 5;

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final ForumRepository forumRepository;
    private final ForumMembershipRepository forumMembershipRepository;
    private final ForumPostRepository forumPostRepository;
    private final ForumReplyRepository forumReplyRepository;

    public List<ForumResponse> getForums(String userEmail) {
        AppUser user = getUserByEmail(userEmail);

        return forumRepository.findAllByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(forum -> toForumResponse(forum, user))
                .toList();
    }

    public ForumResponse getForumBySlug(String userEmail, String forumSlug) {
        AppUser user = getUserByEmail(userEmail);
        Forum forum = getForumBySlug(forumSlug);

        return toForumResponse(forum, user);
    }

    @Transactional
    public ForumResponse subscribe(String userEmail, String forumSlug) {
        AppUser user = getUserByEmail(userEmail);
        Forum forum = getForumBySlug(forumSlug);

        forumMembershipRepository.findByUserAndForum(user, forum)
                .orElseGet(() -> {
                    ForumMembership membership = ForumMembership.builder()
                            .user(user)
                            .forum(forum)
                            .points(0)
                            .build();

                    return forumMembershipRepository.save(membership);
                });

        return toForumResponse(forum, user);
    }

    @Transactional
    public ForumResponse unsubscribe(String userEmail, String forumSlug) {
        AppUser user = getUserByEmail(userEmail);
        Forum forum = getForumBySlug(forumSlug);

        forumMembershipRepository.findByUserAndForum(user, forum)
                .ifPresent(forumMembershipRepository::delete);

        return toForumResponse(forum, user);
    }

    public List<ForumPostResponse> getPosts(String userEmail, String forumSlug) {
        AppUser user = getUserByEmail(userEmail);
        Forum forum = getForumBySlug(forumSlug);

        return forumPostRepository.findAllByForumAndActiveTrueOrderByCreatedAtDesc(forum)
                .stream()
                .map(post -> toPostResponse(post, user))
                .toList();
    }

    @Transactional
    public ForumPostResponse createPost(
            String userEmail,
            String forumSlug,
            ForumPostRequest request
    ) {
        AppUser user = getUserByEmail(userEmail);
        Forum forum = getForumBySlug(forumSlug);
        ForumMembership membership = getRequiredMembership(user, forum);

        validateHtmlContent(request.contentHtml());

        ForumPost post = ForumPost.builder()
                .forum(forum)
                .author(user)
                .title(request.title().trim())
                .contentHtml(request.contentHtml().trim())
                .active(true)
                .build();

        ForumPost savedPost = forumPostRepository.save(post);

        membership.setPoints(membership.getPoints() + POINTS_BY_POST);
        forumMembershipRepository.save(membership);

        return toPostResponse(savedPost, user);
    }

    public ForumPostDetailResponse getPostDetail(String userEmail, Long postId) {
        AppUser user = getUserByEmail(userEmail);
        ForumPost post = getActivePost(postId);

        List<ForumReplyResponse> replies = forumReplyRepository
                .findAllByPostAndActiveTrueOrderByCreatedAtAsc(post)
                .stream()
                .map(reply -> toReplyResponse(reply, user))
                .toList();

        return new ForumPostDetailResponse(
                toPostResponse(post, user),
                replies
        );
    }

    @Transactional
    public ForumReplyResponse createReply(
            String userEmail,
            Long postId,
            ForumReplyRequest request
    ) {
        AppUser user = getUserByEmail(userEmail);
        ForumPost post = getActivePost(postId);
        ForumMembership membership = getRequiredMembership(user, post.getForum());

        validateHtmlContent(request.contentHtml());

        ForumReply reply = ForumReply.builder()
                .post(post)
                .author(user)
                .contentHtml(request.contentHtml().trim())
                .active(true)
                .build();

        ForumReply savedReply = forumReplyRepository.save(reply);

        membership.setPoints(membership.getPoints() + POINTS_BY_REPLY);
        forumMembershipRepository.save(membership);

        return toReplyResponse(savedReply, user);
    }

    @Transactional
    public void deletePost(String userEmail, Long postId) {
        AppUser user = getUserByEmail(userEmail);
        ForumPost post = getActivePost(postId);

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Solo puedes eliminar tus propias publicaciones.");
        }

        post.setActive(false);
        forumPostRepository.save(post);
    }

    @Transactional
    public void deleteReply(String userEmail, Long replyId) {
        AppUser user = getUserByEmail(userEmail);
        ForumReply reply = forumReplyRepository.findByIdAndActiveTrue(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Respuesta no encontrada."));

        if (!reply.getAuthor().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Solo puedes eliminar tus propias respuestas.");
        }

        reply.setActive(false);
        forumReplyRepository.save(reply);
    }

    private ForumResponse toForumResponse(Forum forum, AppUser user) {
        ForumMembership membership = forumMembershipRepository
                .findByUserAndForum(user, forum)
                .orElse(null);

        Boolean subscribed = membership != null;
        Integer points = membership == null ? 0 : membership.getPoints();
        Long postCount = forumPostRepository.countByForumAndActiveTrue(forum);

        return new ForumResponse(
                forum.getId(),
                forum.getSlug(),
                forum.getName(),
                forum.getDescription(),
                forum.getCoverImage(),
                subscribed,
                points,
                postCount
        );
    }

    private ForumPostResponse toPostResponse(ForumPost post, AppUser currentUser) {
        return new ForumPostResponse(
                post.getId(),
                post.getForum().getSlug(),
                post.getTitle(),
                post.getContentHtml(),
                toAuthorResponse(post.getAuthor()),
                forumReplyRepository.countByPostAndActiveTrue(post),
                post.getAuthor().getId().equals(currentUser.getId()),
                post.getCreatedAt()
        );
    }

    private ForumReplyResponse toReplyResponse(ForumReply reply, AppUser currentUser) {
        return new ForumReplyResponse(
                reply.getId(),
                reply.getPost().getId(),
                reply.getContentHtml(),
                toAuthorResponse(reply.getAuthor()),
                reply.getAuthor().getId().equals(currentUser.getId()),
                reply.getCreatedAt()
        );
    }

    private ForumAuthorResponse toAuthorResponse(AppUser author) {
        UserProfile profile = userProfileRepository.findByUser(author)
                .orElse(null);

        String name = profile == null ? author.getName() : profile.getDisplayName();
        String avatar = profile == null ? null : profile.getAvatar();

        return new ForumAuthorResponse(
                author.getId(),
                name,
                avatar
        );
    }

    private ForumMembership getRequiredMembership(AppUser user, Forum forum) {
        return forumMembershipRepository.findByUserAndForum(user, forum)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Debes suscribirte al foro para participar."
                ));
    }

    private Forum getForumBySlug(String slug) {
        return forumRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new IllegalArgumentException("Foro no encontrado."));
    }

    private ForumPost getActivePost(Long postId) {
        return forumPostRepository.findByIdAndActiveTrue(postId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada."));
    }

    private AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private void validateHtmlContent(String html) {
        String plainText = html == null
                ? ""
                : html.replaceAll("<[^>]*>", "").trim();

        if (plainText.isBlank()) {
            throw new IllegalArgumentException("El contenido no puede estar vacío.");
        }
    }
}