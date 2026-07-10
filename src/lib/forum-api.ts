import { apiFetch } from "@/lib/api";
import type {
  ApiForumPostDetailResponse,
  ApiForumPostRequest,
  ApiForumPostResponse,
  ApiForumReplyRequest,
  ApiForumReplyResponse,
  ApiForumResponse,
} from "@/lib/api-types";

export function getForumsRequest() {
  return apiFetch<ApiForumResponse[]>("/api/forums", {
    method: "GET",
  });
}

export function getForumBySlugRequest(forumSlug: string) {
  return apiFetch<ApiForumResponse>(`/api/forums/${forumSlug}`, {
    method: "GET",
  });
}

export function subscribeForumRequest(forumSlug: string) {
  return apiFetch<ApiForumResponse>(`/api/forums/${forumSlug}/subscribe`, {
    method: "POST",
  });
}

export function unsubscribeForumRequest(forumSlug: string) {
  return apiFetch<ApiForumResponse>(`/api/forums/${forumSlug}/subscribe`, {
    method: "DELETE",
  });
}

export function getForumPostsRequest(forumSlug: string) {
  return apiFetch<ApiForumPostResponse[]>(`/api/forums/${forumSlug}/posts`, {
    method: "GET",
  });
}

export function createForumPostRequest(
  forumSlug: string,
  data: ApiForumPostRequest,
) {
  return apiFetch<ApiForumPostResponse>(`/api/forums/${forumSlug}/posts`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getForumPostDetailRequest(postId: number) {
  return apiFetch<ApiForumPostDetailResponse>(`/api/forums/posts/${postId}`, {
    method: "GET",
  });
}

export function createForumReplyRequest(
  postId: number,
  data: ApiForumReplyRequest,
) {
  return apiFetch<ApiForumReplyResponse>(`/api/forums/posts/${postId}/replies`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteForumPostRequest(postId: number) {
  return apiFetch<void>(`/api/forums/posts/${postId}`, {
    method: "DELETE",
  });
}

export function deleteForumReplyRequest(replyId: number) {
  return apiFetch<void>(`/api/forums/replies/${replyId}`, {
    method: "DELETE",
  });
}