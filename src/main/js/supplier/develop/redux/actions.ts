import {User} from "../models/user";

export const updateAccount = (user: User) => ({
    type: "update-account",
    payload: user
});