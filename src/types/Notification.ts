export enum NotificationType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  FOLLOW = "FOLLOW",
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  metadata: {
    username: string;
    postId?: number;
  };
  createdAt: string;
}
