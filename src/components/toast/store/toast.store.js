import { BehaviorSubject, firstValueFrom } from "rxjs"

export const dataToast$ = new BehaviorSubject(null);

const set = (data) => {
    dataToast$.next(data);
}

const get = async () => {
    return await firstValueFrom(dataToast$);
}

export default function ToastStore() {
    return {
        get,
        set,
    }
}