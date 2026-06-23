import { useState, useEffect } from "react";

import { getUserData } from "../services/users.service";
import { User } from "../interfaces/users.interface";

// =======================================================================
//? fetch user data
// api: /users/:id
// ==============================================================

export const useUserData = (userId?: string) => {
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetch = async () => {
            try {
                const result = await getUserData(userId);
                setData(result);
            } catch (err) {
                console.log("error(useUserData):", err);
                setError(`Failed to load user data. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [userId]);

    return { data, loading, error };
}