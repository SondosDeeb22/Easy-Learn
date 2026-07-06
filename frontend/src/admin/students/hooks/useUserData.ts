import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../../shared/services/userData.service";

// =======================================================================
//? fetch user data
// ==============================================================

export const useUserData = (userId?: string) => {
    return useQuery({
        queryKey: ["userData", userId],
        queryFn: () => getUserData(userId!),
        enabled: !!userId, // only run when userId exists
        staleTime: 5 * 60 * 1000, // cache for 5 minutes
    });
};