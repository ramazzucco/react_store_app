import teamStore from "../../_store/team-store";
import ToastStore from "../../components/toast/store/toast.store";
import { translate } from "../../i18n/translate";

export const getTeams = async () => {
    const response = await fetch("http://localhost:3000/teams")
        .then((response) => response.json())
        .then((json) => json);

    if (!response.error) {
        teamStore.teamsState$.next({
            action: "GET TEAMS",
            name: teamStore.teamStateName,
            value:  response
        });
    } else {
        ToastStore().set({
            icon: "error",
            message: translate().simpleText('ERRORS.' + response.message),
            state: "error",
            time: 3000,
        });
    }
};