import api from "./api";

export const Logout = async () => {
    const res = await api.post("/auth/logout", {}, {
        withCredentials: true,
    });
    return res.data;
}