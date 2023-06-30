import React from "react";
import "./button-back.css";
import { useResolvedPath } from "react-router-dom";
import { translate } from "../../i18n/translate";

export default function ButtonBack() {
    const route = useResolvedPath();
    const handleBack = () => {
        if (route.pathname !== "/") window.history.go(-1);
    };

    return (
        route.pathname !== "/" && (
            <button className="button_back" onClick={handleBack}>
                {translate().simpleText("WORDS.BACK")}
            </button>
        )
    );
}
