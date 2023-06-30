import appStore from '../../_store/app-store';
import ToastStore from '../../components/toast/store/toast.store';

const newWidgets = (goalkeeper, defenders, midfielders, forwards, total_players) => {
    let widgets = [
        {
            title: 'GOALKEEPER',
            value: goalkeeper
        },
        {
            title: 'DEFENDERS',
            value: defenders
        },
        {
            title: 'MIDFIELDERS',
            value: midfielders
        },
        {
            title: 'FORWARDS',
            value: forwards
        },
        {
            title: 'TOTAL_PLAYERS',
            value: total_players
        }
    ]

    return widgets;
}

export const getWidgets = async () => {
    const response = await fetch("http://localhost:3000/users")
        .then((res) => res.json())
        .then((json) => json);
    if (!response.error) {
        const goalkeeper = response.filter(p => p.position === 'arquero').length;
        const defenders = response.filter(p => p.position === 'defensor').length;
        const midfielders = response.filter(p => p.position === 'mediocampista').length;
        const forwards = response.filter(p => p.position === 'delantero').length;
        const total_players = response.length;

        appStore.widgetsState$.next({
            action: "GET WIDGETS",
            name: appStore.widgetStateName,
            value:  newWidgets(goalkeeper, defenders, midfielders, forwards, total_players)
        });
    } else {
        ToastStore().set({
            icon: "error",
            message: response.message,
            state: "error",
            time: 3000,
        });
    }
};
