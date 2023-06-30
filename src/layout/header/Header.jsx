import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AppStore from "../../_store/app-store";
import { translate } from "../../i18n/translate";

import "./header.css";

import ButtonBack from "../../components/button-back/ButtonBack";

export default function Header() {
    const [language, setLanguage] = React.useState("");
    const [languageOptions] = React.useState(["SPANISH", "ENGLISH"]);
    const [links] = React.useState([
        { path: "/", title: "HOME" },
        { path: "/teams", title: "TEAMS" },
    ]);

    useEffect(() => {
        const toggleTheme = document.getElementById("toggleTheme");
        AppStore.themeState$.subscribe((theme) => {
            if (toggleTheme && theme)
                toggleTheme.checked = theme.value === "light" ? true : false;
        });
    }, []);

    useEffect(() => {
        AppStore.languageState$.subscribe((language) => {
            setLanguage(language.value);
        });
        const elemntSelect = document.getElementById('lang');
        elemntSelect.childNodes.forEach((child, i) => {
            if(child.value === language) {
                elemntSelect.selectedIndex = i;
            }
        })
    }, [language]);

    const handleChange = async (e) => {
        AppStore.themeState$.next({
            action: "CHANGE THEME",
            name: AppStore.themeStateName,
            value: e.target.checked ? "light" : "dark",
        });
    };

    const handleLanguage = (e) => {
        AppStore.languageState$.next({
            action: "CHANGE LANGUAGE",
            name: AppStore.languageStateName,
            value: e.target.value,
        });
    };

    return (
        <header className="header">
            <ButtonBack />
            <div className="links">
                {links.map((link, i) => (
                    <Link to={link.path} key={i}>
                        {translate().simpleText("NAVLINKS." + link.title)}
                    </Link>
                ))}
            </div>
            <div className="language">
                <select name="lang" id="lang" onChange={handleLanguage}>
                    {languageOptions.map((option) => (
                        <option  value={option} key={option}>
                            {translate().simpleText("LANG." + option)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="checkbox-wrapper-63">
                <label className="switch">
                    <input
                        type="checkbox"
                        id="toggleTheme"
                        onChange={handleChange}
                    />
                    <span className="slider"></span>
                </label>
            </div>
        </header>
    );
}
