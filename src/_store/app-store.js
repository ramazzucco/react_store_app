import { BehaviorSubject } from "rxjs";
import { SaveState, get, initModule, log } from "./_store";
import { setLanguage } from "../i18n/translate";

function AppStore(get, SaveState, log) {
    const themeStateName = "theme";
    const themeState$ = new BehaviorSubject(null);
    themeState$.subscribe((state) => {
        state && SaveState(state);
    });

    const widgetStateName = "widgets";
    const widgetsState$ = new BehaviorSubject(null);
    widgetsState$.subscribe((state) => {
        state && SaveState(state);
    });

    const languageStateName = "language";
    const languageState$ = new BehaviorSubject(null);
    languageState$.subscribe((state) => {
        if(state) {
            SaveState(state);
            setLanguage(state.value);
        }
    });

    const initLanguage = (_languageStateName, _languageState) => {
        const languageOnStorage = get(_languageStateName);
        if (languageOnStorage) {
            _languageState.next({
                action: "INIT",
                name: _languageStateName,
                value: languageOnStorage,
            });
        } else {
            _languageState.next({
                action: "INIT",
                name: _languageStateName,
                value: "SPANISH",
            });
        }
    }

    const initTheme = (_themeStateName, _themeState) => {
        const themeOnStorage = get(_themeStateName);
        if (themeOnStorage) {
            _themeState.next({
                action: "INIT",
                name: _themeStateName,
                value: themeOnStorage,
            });
        } else {
            _themeState.next({
                action: "INIT",
                name: _themeStateName,
                value: "light",
            });
        }
    }

    const initWidgets = (_widgetStateName, _widgetsState$) => {
        const widgetOnStorage = get(_widgetStateName);
        if(widgetOnStorage) {
            _widgetsState$.next({
                action: "INIT",
                name: _widgetStateName,
                value: widgetOnStorage
            });
        } else {
            const value = [
                {
                    title: 'GOALKEEPER',
                    value: 0
                },
                {
                    title: 'DEFENDERS',
                    value: 0
                },
                {
                    title: 'MIDFIELDERS',
                    value: 0
                },
                {
                    title: 'FORWARDS',
                    value: 0
                },
                {
                    title: 'TOTAL_PLAYERS',
                    value: 0
                }
            ];
            _widgetsState$.next({
                action: "INIT",
                name: _widgetStateName,
                value
            })
        }
    }

    const init = (_languageStateName, _languageState, _themeStateName, _themeState, _widgetStateName, _widgetsState$) => {
        initLanguage(_languageStateName, _languageState);
        initTheme(_themeStateName, _themeState);
        initWidgets(_widgetStateName, _widgetsState$);
    }
    init(languageStateName, languageState$, themeStateName, themeState$, widgetStateName, widgetsState$);

    return {
        languageStateName,
        languageState$,
        themeStateName,
        themeState$,
        widgetStateName,
        widgetsState$,
    }
}
const appStore = AppStore(get, SaveState, log);
initModule(['language','theme','widgets']);
export default appStore;