// ユーザー権限
export enum USER_ROLE {
  LIMIT_VIEWING = 1,
  ALL_VIEWING = 2,
  ADMIN = 3,
}

// 投稿側観覧権限
export enum VIEW_PERMISSION {
  GUEST = 0,
  LIMIT = USER_ROLE.LIMIT_VIEWING,
  ALL = USER_ROLE.ALL_VIEWING,
  ADMIN = USER_ROLE.ADMIN,
}

// TODO: 公開非公開がいらない権限のみの判定で良い
export enum PUBLICATION_STATUS {
  PUBLIC = 0,
  PRIVATE = 1,
}
