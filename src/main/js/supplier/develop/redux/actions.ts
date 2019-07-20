import {User} from "../models/User";

export const updateAccount = (user: User) => ({
    type: "update-account",
    payload: user
});