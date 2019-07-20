import {User} from "../../models/User";

const loginAccountJson = localStorage.getItem("login-account");

let loginAccount;

if (loginAccountJson) {
    try {
        loginAccount = JSON.parse(loginAccountJson);
    } catch (e) {
        console.warn("invalid login account info " + loginAccountJson);
    }
}

const initialState = {
    loginAccount
};

export default function (state = initialState, action: { type: string, payload: User }) {
    switch (action.type) {
        case "update-account":
            localStorage.setItem("login-account", JSON.stringify(action.payload));
            return {
                ...state,
                loginAccount: action.payload
            };
        default:
            return state;
    }
}