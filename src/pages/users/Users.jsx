import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { deleteUser, getUsers } from './user.service';
import { translate } from '../../i18n/translate';
import { sortByPosition } from './user.actions';
import userStore from '../../_store/user-store';
import appStore from '../../_store/app-store';

import './users.css';
import { firstValueFrom } from 'rxjs';

export default function Users() {
  const [users, setUsers] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [language, setLanguage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [sortOptions, setSortOptions] = React.useState([]);

  const params = useParams();
  const dialog = document.getElementById('dialog');

  const setOptionsSort = (state) => {
    const options = Object.keys(state.value[0])
      .map(opt => translate().simpleText('PLAYER_TABLE.' + opt.toUpperCase()))
      .filter(opt => opt !== undefined);
    setSortOptions(options)
  }

  useEffect(() => {
    userStore.usersState$.subscribe((state) => {
      if(state && state.value) {
        setUsers(state.value);
        setOptionsSort(state);
      }
    });
    appStore.languageState$.subscribe(async(state) => {
      if(state && state.value) {
        setLanguage(state.value);
        const _users = await firstValueFrom(userStore.usersState$);
        _users && _users.value && setOptionsSort(_users)
      }
    });
    getUsers(params.team);

    return () => userStore.usersState$.next({
      action: "RESET",
      name: userStore.userStateName,
      value: null,
    });
  }, []);

  useEffect(() => {
    userStore.userDeleted$.subscribe((userWasDeleted) => {
      if(userWasDeleted && userWasDeleted.value) {
        setLoading(false);
        dialog && dialog.close();
      }
    });
    userStore.userError$.subscribe((error) => {
      if(error && error.value) setLoading(false);
    });
  }, [dialog]);

  const openModal = (user) => {
    setUser(user);
    dialog.showModal();
  }

  const handleClose = (e, fromButton) => {
    if(e.target.tagName === 'DIALOG' || fromButton) {
      dialog.close();
      setUser(null);
    }
  }

  const _deleteUser = async () => {
    setLoading(true);
    deleteUser(user);
  }

  const handleSort = (e) => {
    if(e.target.value !== '') {
      setLoading(true);
      sortByPosition(users, e.target.value).then(() => setLoading(false));
    }
  }

  return (
    <>
      <dialog id='dialog' onClick={handleClose}>
        <div className="wrapper_dialog">
          <header>
            <h6 className='title'>{ language && translate().simpleText('WORDS.DELETE') }</h6>
          </header>
          <section>
            <p>{ user && language && translate().textWithParams('PLAYER_MODAL.TEXT', {user: user.fullname}) }</p>
          </section>
          <footer>
            <button className='cancel' type='button' onClick={(e) => handleClose(e, true)}>
              { language && translate().simpleText('BUTTONS.CANCEL') }
            </button>
            <button type='button' className='delete' onClick={() => _deleteUser()}>
              { loading && (
                <div className="wrapper_simple_loader">
                  <span className="simple_loader"></span>
                  <span>{ language && translate().simpleText('WORDS.DELETING') }...</span>
                </div>
              )}
              { !loading && <span>{ language && translate().simpleText('BUTTONS.YES_DELETE') }</span> }
            </button>
          </footer>
        </div>
      </dialog>
      <div className="page users">
        <div className="header_users">
          <h1>{ language && translate().simpleText('WORDS.PLAYERS') }</h1>
          <Link to={'/player/create'}>
            <button>
              { language && translate().simpleText('BUTTONS.NEW_USER') }
            </button>
          </Link>
        </div>
        <div className="wrapper_table">
          <div className="table_actions">
            <select name="sort" id="sort" onChange={handleSort}>
              <option value="">{ translate().simpleText('WORDS.SORT_BY') }</option>
                {sortOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
          </div>
          <table border={0}>
              <thead>
                  <tr>
                      <th>N°</th>
                      <th>{ language && translate().simpleText('PLAYER_TABLE.FULLNAME') }</th>
                      <th>{ language && translate().simpleText('PLAYER_TABLE.POSITION') }</th>
                      <th>{ language && translate().simpleText('PLAYER_TABLE.ROLE') }</th>
                      <th>{ language && translate().simpleText('PLAYER_TABLE.TEAM') }</th>
                      <th>{ language && translate().simpleText('PLAYER_TABLE.AGE') }</th>
                      <th>{ language && translate().simpleText('PLAYER_TABLE.TSHIRT_NUMBER') }</th>
                      <th>{ language && translate().simpleText('PLAYER_TABLE.ACTIONS') }</th>
                  </tr>
              </thead>
              <tbody>
                  {
                    !users && (
                      <tr>
                        <td colSpan="7">
                            <div className="wrapper_loader">
                                <span className="loader"></span>
                            </div>
                        </td>
                      </tr>
                    )
                  }
                  {
                    users && users.map((user, i) => (
                      <tr key={i}>
                          <td>{ i+1 }</td>
                          <td>{ user.fullname }</td>
                          <td>{ user.position }</td>
                          <td>{ user.role }</td>
                          <td>{ user.team }</td>
                          <td className='center'>{ user.age }</td>
                          <td className='center'>{ user.tshirt_number }</td>
                          <td className="actions">
                              <button className="delete" onClick={() => openModal(user)}>
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                              </button>
                              <Link to={'/player/' + user._id + '/edit'}>
                                  <button className="edit">
                                      <span className="material-symbols-outlined">
                                        edit_square
                                      </span>
                                  </button>
                              </Link>
                          </td>
                      </tr>
                    ))
                  }
              </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
