import axios from "axios";

export interface ActivityBlock {
  id: string;
  user: string;
  device: string;
  app: string;
  startTime: string;
  endTime: string;
  confidence: number;
  keys: number;
  mouse: number;
  idle: number;
  screenshot: string;
}

export interface ActivityFilters {
  startDate?: string;
  endDate?: string;
  app?: string;
  idle?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getActivityBlocks = async (
  filters: ActivityFilters
) => {
  const { data } = await axios.get("/api/activity-blocks", {
    params: filters,
  });
  return data;
};

export const deleteActivityBlock = async (id: string) => {
  await axios.delete(`/api/activity-blocks/${id}`);
};
