// import { useQuery } from 'react-query'
// import { api as apiCalls } from './use-data'
//
// const url = 'coupon'
//
// export function useValidCoupons(userId, products = []) {
//     return useQuery(
//         ['valid-coupons', userId, products],
//         () => {
//             return apiCalls.create(`${url}/valid`, {
//                 user_id: userId,
//                 products
//             })
//         },
//         {
//             enabled: !!userId, // Only fetch when we have a user ID
//             staleTime: 5 * 60 * 1000, // 5 minutes
//             cacheTime: 10 * 60 * 1000 // 10 minutes
//         }
//     )
// }