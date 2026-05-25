import { useQuery } from '@tanstack/react-query';
import axios from '../../../lib/axios';

// export const CaseList = () => {
//   return useQuery({
//     queryKey: ['cases-list'],
//     queryFn: async () => {
//     const res = await axios.get('/Case/getAll');
//       return res.data.data;
//     },
//   });
// };
export const CaseList = () => {
  return useQuery({
    queryKey: ['cases-list'],
    queryFn: async () => {
      const res = await axios.get('/Case/getAll?page=1&pageSize=100');

      console.log(res.data.data);

      return res.data.data.items || [];
    },
  });
};