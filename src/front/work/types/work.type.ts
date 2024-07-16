import { Work } from '@prisma/client';

export type WorkTool = {
  toolName: string;
};

export type DetailWork = Omit<
  Work,
  | 'createdAt'
  | 'permission'
  | 'order'
  | 'publication'
  | 'updateAt'
  | 'archiveImg'
  | 'order'
> & {
  useTools: WorkTool[];
};

export type NextWork = Pick<Work, 'titleEn' | 'id'>;

export type DetailWorkRes = {
  item: DetailWork;
  nextContents: NextWork | null;
};
