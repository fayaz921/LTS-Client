// ============================================================
// BENCH API FILE
// Yeh file backend se baat karti hai — yaani API calls karta hai.
// Sochlo ke yeh file ek "messenger" hai jo:
//   1. Backend server ko request bhejti hai
//   2. Jo jawab milta hai woh wapis component ko deta hai
//
// axios = woh tool jo HTTP requests karta hai (GET, POST, DELETE)
// Humne already lib/axios.ts mein setup kiya hai JWT token ke saath
// ============================================================

import axios from '../../../lib/axios';
// Upar se BenchDto aur CreateBenchDto types import kiye
// Taake TypeScript ko pata ho ke data ka shape kya hoga
import type { BenchDto, CreateBenchDto } from '../types/bench.types';

// -------------------------------------------------------
// FUNCTION 1: getBenchByCase
// Yeh function ek specific case ke saare judges fetch karta hai
// Parameter: caseId = kis case ke judges chahiye
// Return: Promise<BenchDto[]> = ek array of bench entries
//
// "async" matlab yeh function asynchronous hai — yaani
// result milne mein time lagta hai (server se data aata hai)
// "await" matlab — yahan ruko jab tak response nahi aata
// -------------------------------------------------------
export const getBenchByCase = async (caseId: string): Promise<BenchDto[]> => {
  const res = await axios.get(`/bench/case/${caseId}`);
  // res.data.data = backend ki ApiResponse wrapper se actual data nikalta hai
  return res.data.data;
};

// -------------------------------------------------------
// FUNCTION 2: createBench
// Naya judge add karna — backend ko data POST karta hai
// Parameter: data = CreateBenchDto (judge ki info)
// -------------------------------------------------------
export const createBench = async (data: CreateBenchDto) => {
  const res = await axios.post('/bench/createbench', data);
  return res.data;
};

// -------------------------------------------------------
// FUNCTION 3: deleteBench
// Ek judge ko delete karna — uski ID se
// Parameter: id = us bench entry ka unique ID jo delete karna hai
// -------------------------------------------------------
export const deleteBench = async (id: string) => {
  const res = await axios.delete(`/bench/${id}`);
  return res.data;
};