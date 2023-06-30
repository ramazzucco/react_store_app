import userStore from "../../_store/user-store";

const sorting = (players, param) => {
    return players.sort((a, b) => {
        const positionA = a[param.toLowerCase()].toUpperCase();
        const positionB = b[param.toLowerCase()].toUpperCase();
        if (positionA < positionB) {
            return -1;
        }
        if (positionA > positionB) {
            return 1;
        }
        return 0;
    });
};

export const sortByPosition = async (users, param) => {
    const usersOredered = !['age','tshirt_number'].includes(param) ? sorting(users, param) : users.sort((a,b) => a[param] - b[param]);
    userStore.usersState$.next({
        action: "SORT BY POSITION",
        name: userStore.userStateName,
        value: usersOredered,
    });
    return await true;
};
