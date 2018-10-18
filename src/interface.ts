export interface IResponse {
  meta: IMetaData;
  data?: any;
}

export interface IMetaData {
  status: number;
  message: string;
  limit?: number;
  offset?: number;
  totalCount?: number;
  stack?: string;
}

export interface IPagination {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  totalCount?: number;
}
