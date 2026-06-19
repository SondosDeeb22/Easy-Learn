import { useState, useEffect } from "react";

import { getUserData } from "../services/users.service";
import { UserData } from "../interfaces/users.interface";

// =======================================================================
//? fetch user data
// api: /users/:id
// ==============================================================

export const useUserData = (studentId: string) => {
    const [data, setData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getUserData(studentId);
                setData(result);
            } catch (err) {
                console.log("error(userDataHook):", err);
                setError(`Failed to load user data. Please, try later`);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { data, loading, error };
}