"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useRecommendationsUsername } from "@/features/client/recommendations/hooks/useRecommendationsUsername"

import {
  addReviewComment,
  addReviewCommentBulk,
  deleteReviewComment,
  deleteReviewCommentsBulk,
  getUserReviews,
  updateReviewRatingBulk,
} from "../reviews-api"

export function useUserReviews() {
  const queryClient = useQueryClient()
  const username = useRecommendationsUsername()
  const reviewsQueryKey = ["client", "reviews", username]

  const reviewsQuery = useQuery({
    queryKey: reviewsQueryKey,
    queryFn: () => getUserReviews(username),
    enabled: Boolean(username),
    staleTime: 2 * 60 * 1000,
  })

  const addCommentMutation = useMutation({
    mutationFn: ({
      productId,
      comment,
    }: {
      productId: number
      comment: string
    }) => addReviewComment(username, productId, comment),
    onSuccess: (data) => {
      toast.success(data.message || "Comentario agregado correctamente")
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKey })
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo agregar el comentario")
    },
  })

  const addCommentBulkMutation = useMutation({
    mutationFn: ({
      productIds,
      comment,
    }: {
      productIds: number[]
      comment: string
    }) => addReviewCommentBulk(username, productIds, comment),
    onSuccess: (data) => {
      toast.success(data.message || "Comentarios agregados correctamente")
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKey })
    },
    onError: (error) => {
      toast.error(error.message || "No se pudieron agregar los comentarios")
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (productId: number) => deleteReviewComment(username, productId),
    onSuccess: (data) => {
      toast.success(data.message || "Comentario eliminado correctamente")
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKey })
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo eliminar el comentario")
    },
  })

  const deleteCommentsBulkMutation = useMutation({
    mutationFn: (productIds: number[]) =>
      deleteReviewCommentsBulk(username, productIds),
    onSuccess: (data) => {
      toast.success(data.message || "Comentarios eliminados correctamente")
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKey })
    },
    onError: (error) => {
      toast.error(error.message || "No se pudieron eliminar los comentarios")
    },
  })

  const updateRatingBulkMutation = useMutation({
    mutationFn: ({
      productIds,
      rating,
    }: {
      productIds: number[]
      rating: number
    }) => updateReviewRatingBulk(username, productIds, rating),
    onSuccess: (data) => {
      toast.success(data.message || "Ratings actualizados correctamente")
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKey })
    },
    onError: (error) => {
      toast.error(error.message || "No se pudieron actualizar los ratings")
    },
  })

  return {
    username,
    reviewsQuery,
    reviews: reviewsQuery.data?.reviews ?? [],
    addComment: addCommentMutation.mutate,
    addCommentBulk: addCommentBulkMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    deleteCommentsBulk: deleteCommentsBulkMutation.mutate,
    updateRatingBulk: updateRatingBulkMutation.mutate,
    commentingProductId: addCommentMutation.variables?.productId ?? null,
    deletingProductId: deleteCommentMutation.variables ?? null,
    isAddingComment: addCommentMutation.isPending,
    isAddingCommentBulk: addCommentBulkMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isDeletingCommentsBulk: deleteCommentsBulkMutation.isPending,
    isUpdatingRatingBulk: updateRatingBulkMutation.isPending,
  }
}
