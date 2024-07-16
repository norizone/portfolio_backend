import { Work } from '@prisma/client';

/**
 * Work
 */
export type WorkTool = {
  id: number;
};

export type DetailWorkRes = {
  id: number;
  permission: number;
  publication: number;
  title: string;
  titleEn: string;
  archiveImg: string;
  useTools: {
    id: number;
  }[];
  comment?: string | null;
  url?: string | null;
  gitUrl?: string | null;
  role: string;
  singleImgMain: string;
  singleImgSub: string;
  singleImgSub2?: string | null;
};

// export type EditCreateWorkBody = Omit<DetailWork, 'id'>;

export type WorkList = Pick<Work, 'id' | 'title' | 'order' | 'publication'>;

export type WorkListRes = {
  items: WorkList[];
  totalPages: number;
  totalCount: number;
};
