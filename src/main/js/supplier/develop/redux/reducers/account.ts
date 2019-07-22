import {User} from "../../models/user";

export default function (state = {}, action: { type: string, payload: User }) {
    switch (action.type) {
        case "update-account":
            return {
                ...state,
                loginAccount: action.payload
            };
        default:
            return state;
    }
}