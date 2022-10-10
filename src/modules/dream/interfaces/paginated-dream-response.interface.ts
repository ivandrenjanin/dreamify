import { Dream } from '../../../entities/dream.entity';

export interface PaginatedDreamResponse {
  data: Dream[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}
