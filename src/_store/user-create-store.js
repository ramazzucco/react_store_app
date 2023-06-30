import { BehaviorSubject } from "rxjs";
import { SaveState, get, initModule, log } from "./_store";

function UserCreateStore(get, SaveState, log) {
    const userCreateStateName = "user-create";
    const usersCreateState$ = new BehaviorSubject(null);
    const userCreated$ = new BehaviorSubject(null);
    const userCreateError$ = new BehaviorSubject(null);
    usersCreateState$.subscribe((state) => {
        state && SaveState(state);
    });
    userCreated$.subscribe((state) => {
        state && log(state);
    });
    userCreateError$.subscribe((state) => {
        state && log(state);
    });

    const init = async (_stateName, _state$) => {
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
    init(userCreateStateName, usersCreateState$);

    return {
        userCreateStateName,
        usersCreateState$,
        userCreated$,
        userCreateError$
    }
}
const userCreateStore = UserCreateStore(get, SaveState, log);
initModule(['user-create']);
export default userCreateStore;