import { BehaviorSubject } from "rxjs";
import { SaveState, get, initModule, log } from "./_store";

function UserEditStore(get, SaveState, log) {
    const userEditStateName = "user-edit";
    const userDetailState$ = new BehaviorSubject(null);
    const userEdited$ = new BehaviorSubject(null);
    const userEditError$ = new BehaviorSubject(null);
    userDetailState$.subscribe((state) => {
        state && SaveState(state);
    });
    userEdited$.subscribe((state) => {
        state && log(state);
    });
    userEditError$.subscribe((state) => {
        state && log(state);
    });

    const init = (_stateName, _state$) => {
        const stateOnStorage = get(_stateName);
        if(stateOnStorage) {
            _state$.next({
                action: "INIT",
                name: _stateName,
                value: stateOnStorage
            });
        } else {
            _state$.next({
                action: "INIT",
                name: _stateName,
                value: null
            });
        }
    }
    init(userEditStateName, userDetailState$);

    return {
        userEditStateName,
        userDetailState$,
        userEdited$,
        userEditError$
    }
}
const userEditStore = UserEditStore(get, SaveState, log);
initModule(['user-edit']);
export default userEditStore;