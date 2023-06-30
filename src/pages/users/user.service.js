import userCreateStore from "../../_store/user-create-store";
import userEditStore from "../../_store/user-edit-store";
import userStore from "../../_store/user-store";
import ToastStore from "../../components/toast/store/toast.store";
import { translate } from "../../i18n/translate";

export const getUsers = async (team) => {
    const response = await fetch("http://localhost:3000/users/team/" + team)
        .then((response) => response.json())
        .then((json) => json);

    if (!response.error) {
        userStore.usersState$.next({
            action: "GET USERS",
            name: userStore.userStateName,
            value: response,
        });
    } else {
        ToastStore().set({
            icon: "error",
            message: translate().simpleText("ERRORS." + response.message),
            state: "error",
            time: 3000,
        });
    }
};

export const getDetail = async (id) => {
    const user = await fetch("http://localhost:3000/users/" + id)
        .then((response) => response.json())
        .then((json) => json);

    if (!user.error) {
        userEditStore.userDetailState$.next({
            action: `GET DETAIL "${user.fullname}"`,
            name: userEditStore.userEditStateName,
            value: user,
        });
    } else {
        ToastStore().set({
            icon: "error",
            message: translate().simpleText("ERRORS." + user.message),
            state: "error",
            time: 3000,
        });
        userEditStore.userDetailState$.next({
            action: `GET DETAIL ERROR`,
            name: userEditStore.userEditStateName,
            value: null,
        });
    }
};

export const createUser = async (state) => {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
    };
    const newUser = await fetch("http://localhost:3000/users", options)
        .then((response) => response.json())
        .then((json) => json);

    if (newUser.error) {
        userCreateStore.userCreateError$.next({
            action: "USER ERROR",
            name: userCreateStore.userCreateStateName,
            value: translate().simpleText("ERRORS." + newUser.message),
        });
        ToastStore().set({
            icon: "error",
            message: translate().simpleText("ERRORS." + newUser.message),
            state: "error",
            time: 2300,
        });
        return null;
    }

    ToastStore().set({
        icon: "check_circle",
        message: translate().textWithParams("SUCCESS_MESSAGES.USER_CREATED", {
            fullname: newUser.fullname,
        }),
        state: "success",
        time: 2300,
    });
    userCreateStore.userCreated$.next({
        action: "USER CREATED",
        name: userCreateStore.userCreateStateName,
        value: newUser,
    });
};

export const editUser = async (user) => {
    const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([user]),
    };
    const userEdited = await fetch(
        "http://localhost:3000/users/" + user._id,
        options
    )
        .then((response) => response.json())
        .then((json) => json);

    if (userEdited.error) {
        userEditStore.userEditError$.next({
            action: "USER ERROR",
            name: userEditStore.userEditStateName,
            value: translate().simpleText("ERRORS." + userEdited.message),
        });
        ToastStore().set({
            icon: "error",
            message: translate().simpleText("ERRORS." + userEdited.message),
            state: "error",
            time: 2300,
        });
        return null;
    }

    ToastStore().set({
        icon: "check_circle",
        message: translate().textWithParams("SUCCESS_MESSAGES.USER_UPDATED", {
            fullname: userEdited.fullname,
        }),
        state: "success",
        time: 2300,
    });
    userEditStore.userEdited$.next({
        action: `USER EDITED "${userEdited.fullname}"`,
        name: userEditStore.userEditStateName,
        value: userEdited,
    });
};

export const deleteUser = async (user) => {
    const options = {
        method: "DELETE",
    };
    const newState = await fetch(
        "http://localhost:3000/users/" + user._id,
        options
    )
        .then((response) => response.json())
        .then((json) => json);

    if (!newState.error) {
        ToastStore().set({
            icon: "check_circle",
            message: translate().textWithParams(
                "SUCCESS_MESSAGES.USER_DELETED",
                { fullname: user.fullname }
            ),
            state: "success",
            time: 3000,
        });
        userStore.usersState$.next({
            action: "UPDATE USERS",
            name: userStore.userStateName,
            value: newState.users,
        });
        userStore.userDeleted$.next({
            action: "USER DELETED " + user.fullname,
            name: userStore.userStateName,
            value: true,
        });
    } else {
        ToastStore().set({
            icon: "error",
            message: translate().simpleText("ERRORS." + newState.message),
            state: "error",
            time: 3000,
        });
        userStore.userError$.next({
            action: "USER ERROR",
            name: userStore.userStateName,
            value: translate().simpleText("ERRORS." + newState.message),
        });
    }
};
