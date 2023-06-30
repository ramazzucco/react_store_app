import React, { useEffect } from "react";
import { getWidgets } from "./home.service";
import appStore from "../../_store/app-store";
import { translate } from "../../i18n/translate";

import "./home.css";

export default function Home() {
    const [widgets, setWidgets] = React.useState(null);
    const [language, setLanguage] = React.useState(null);

    const _getWidgets = async () => {
        await getWidgets();
    };

    useEffect(() => {
        appStore.widgetsState$.subscribe(
            (state) => state && setWidgets(state.value)
        );
        appStore.languageState$.subscribe(state => state && setLanguage(state.value));
        _getWidgets();

        return () =>
            appStore.widgetsState$.next({
                action: "RESET",
                name: appStore.widgetStateName,
                value: null,
            });
    }, []);

    return (
        <div className="page home">
            {!widgets && (
                <div className="wrapper_cards">
                    <div className="shimmer"></div>
                    <div className="shimmer"></div>
                    <div className="shimmer"></div>
                </div>
            )}
            <div className="wrapper_cards">
                {widgets &&
                    widgets.map((w, i) => {
                        return (
                            <div className="card" key={i}>
                                <span>{ language && translate().simpleText('WIDGET.' + w.title) }</span>
                                <span>{w.value}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
