import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams } from "../team-service";
import { translate } from "../../../i18n/translate";
import teamStore from "../../../_store/team-store";
import appStore from "../../../_store/app-store";

import './teamList.css';

export default function TeamList() {
    const [teams, setTeams] = React.useState(null);
    const [language, setLanguage] = React.useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        teamStore.teamsState$.subscribe(state => state && setTeams(state.value));
        appStore.languageState$.subscribe(state => state && setLanguage(state.value));
        getTeams();
        return () => teamStore.reset();
    }, []);

    const handleSelectTeam = (team) => {
        navigate('/player/' + team);
    }

    return (
        <div className="page team_list">
             <div className="header_team_list">
                <h1>{ language && translate().simpleText('TEAMS.TITLE') }</h1>
            </div>
            <div className="content">
                {
                    teams && teams.map((team, i) => (
                        <button to={'/users'} onClick={() => handleSelectTeam(team.name)} key={i}>
                            <div className="card">
                                <p>{ language && translate().simpleText('TEAMS.' + team.name.toUpperCase() ) }</p>
                                <div className="awards">
                                    {
                                        team.awards.world_cup.map((award,i) => (
                                            <span className="material-symbols-outlined" key={i}>
                                                trophy
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </button>
                    ))
                }
            </div>
        </div>
    );
}
