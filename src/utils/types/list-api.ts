export type ListApiResponse<T> = {
  message: string;
  results: T[];
};

export type Paginated<T> = {
  total: number;
  page: number;
  page_size: number;
  results: T[];
};

export type ListPaginatedResponse<T> = {
  message: string;
  data: Paginated<T>;
};
