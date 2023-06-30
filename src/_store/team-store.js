import { BehaviorSubject } from "rxjs";
import { SaveState, get, initModule, log } from "./_store";

function TeamStore(get, SaveState, log) {
    const teamStateName = "team";
    const teamsState$ = new BehaviorSubject(null);
    teamsState$.subscribe((state) => {
        state && SaveState(state);
    });

    const init = (_teamStateName, _teamsState$) => {
        const teamOnStorage = get(_teamStateName);
        if(teamOnStorage) {
            _teamsState$.next({
                action: "INIT",
                name: _teamStateName,
                value: teamOnStorage
            });
        } else {
            _teamsState$.next({
                action: "INIT",
                name: _teamStateName,
                value: null
            });
        }
    }
    init(teamStateName, teamsState$);

    const reset = () => {
        teamsState$.next({
            action: "RESET",
            name: teamStateName,
            value: null
        });
    }

    return {
        teamStateName,
        teamsState$,
        reset,
    }
}
const teamStore = TeamStore(get, SaveState, log);
initModule(['team']);
export default teamStore;