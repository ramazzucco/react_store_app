import { BehaviorSubject } from "rxjs";
import { SaveState, get, initModule, log } from "./_store";

function UserStore(get, SaveState, log) {
    const userStateName = "user";
    const usersState$ = new BehaviorSubject(null);
    const userDeleted$ = new BehaviorSubject(null);
    const userError$ = new BehaviorSubject(null);
    usersState$.subscribe((state) => {
        state && SaveState(state);
    });
    userDeleted$.subscribe((state) => {
        state && log(state);
    });
    userError$.subscribe((state) => {
        state && log(state);
    });

    const init = (_userStateName, _usersState$) => {
        const userOnStorage = get(_userStateName);
        if(userOnStorage) {
            _usersState$.next({
                action: "INIT",
                name: _userStateName,
                value: userOnStorage
            });
        } else {
            _usersState$.next({
                action: "INIT",
                name: _userStateName,
                value: null
            });
        }
    }
    init(userStateName, usersState$);

    return {
        userStateName,
        usersState$,
        userDeleted$,
        userError$
    }
}
const userStore = UserStore(get, SaveState, log);
initModule(['user']);
export default userStore;