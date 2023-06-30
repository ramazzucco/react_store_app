import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Components.
import Home from "../pages/home/Home";
import Users from "../pages/users/Users";
import EditUser from "../pages/users/components/edit/EditUser";
import CreateUser from "../pages/users/components/create/CreateUser";
import TeamList from "../pages/team/list/TeamList";

export const Routes = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/teams",
                    element: <TeamList />,
                },
                {
                    path: "/player/:team",
                    element: <Users />,
                },
                {
                    path: "/player/create",
                    element: <CreateUser />,
                },
                {
                    path: "/player/:id/edit",
                    element: <EditUser />,
                },
            ]
        },
    ]
);
