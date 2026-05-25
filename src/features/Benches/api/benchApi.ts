import axios from '../../../lib/axios';
import type { BenchDto, CreateBenchDto, PaginatedBenchResponse } from '../types/bench.types';

export const getAllBenches = async (
  page: number,
  pageSize: number,
  search: string
): Promise<PaginatedBenchResponse> => {
  const res = await axios.get(
    `/bench/getAll?page=${page}&pageSize=${pageSize}&search=${search}`
  );
  
  // Handle response structure from backend
  return {
    items: res.data.data || [],
    total: res.data.total || 0,
  };
};

export const getBenchByCase = async (
  caseId: string
): Promise<BenchDto[]> => {

  const res = await axios.get(`/bench/case/${caseId}`);

  return res.data.data;
};

export const createBench = async (data: CreateBenchDto) => {

  const res = await axios.post('/bench/createbench', data);

  return res.data;
};

export const deleteBench = async (id: string) => {

  const res = await axios.delete(`/bench/${id}`);

  return res.data;
};