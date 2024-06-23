// ユーザー権限
export enum USER_ROLE {
  LIMIT_VIEWING = 1,
  ALL_VIEWING = 2,
}

// 投稿側観覧権限
export enum VIEW_PERMISSION {
  GUEST = 0,
  LIMIT = USER_ROLE.LIMIT_VIEWING,
  ALL = USER_ROLE.ALL_VIEWING,
}

export enum PUBLICATION_STATUS {
  PUBLIC = 0,
  PRIVATE = 1,
}
