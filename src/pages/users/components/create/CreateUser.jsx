import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../user.service';
import { translate } from '../../../../i18n/translate';
import userStore from '../../../../_store/user-store';
import userCreateStore from '../../../../_store/user-create-store';
import appStore from '../../../../_store/app-store';

import './create.css';

export default function CreateUser() {
  const [loading, setLoading] = React.useState(false);
  const [language, setLanguage] = React.useState({});
  const [form, setForm] = React.useState({
    age: '',
    fullname: '',
    position: '',
    role: '',
    team: '',
    tshirt_number: '',
  });
  const [invalidForm, setInvalidForm] = React.useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    appStore.languageState$.subscribe(state => state && setLanguage(state.value));
    userCreateStore.userCreated$.subscribe((createdSuccess) => {
      if(createdSuccess && createdSuccess.value) navigate('/player/' + createdSuccess.value.team);
    });
    userCreateStore.userCreateError$.subscribe(error => {
      if(error && error.value) setLoading(false);
    });
    return () => {
      userCreateStore.userCreated$.next({
        action: "RESET USER CREATED",
        name: userStore.userStateName,
        value:  false
      });
      userCreateStore.userCreateError$.next({
        action: "RESET USER ERROR",
        name: userStore.userStateName,
        value:  null
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form, [e.target.name]: ['age','tshirt_number'].includes(e.target.name) ? Number(e.target.value) : e.target.value
    });
  }

  const handleValidate = () => {
    setInvalidForm(Object.values(form).some(value => value === ''));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invalidForm) {
      setLoading(true);
      createUser(form);
    }
  }

  const handleReset = () => {
    setForm({
      age: '',
      fullname: '',
      position: '',
      role: '',
      team: '',
      tshirt_number: '',
    });
  }

  return (
    <div className='page create_user'>
      <h1>{ language && translate().simpleText('PLAYER_CREATE.TITLE') }</h1>
      <form onSubmit={handleSubmit}>
          <div className="form_item">
              <label>{ language && translate().simpleText("PLAYER_TABLE.FULLNAME") }</label>
              <input type="text" name="fullname" onChange={handleChange} onKeyUp={handleValidate} value={form.fullname} />
          </div>
          <div className="form_item">
              <label>{ language && translate().simpleText("PLAYER_TABLE.AGE") }</label>
              <input type="text" name="age" onChange={handleChange} onKeyUp={handleValidate} value={form.age} />
          </div>
          <div className="form_item">
              <label>{ language && translate().simpleText("PLAYER_TABLE.POSITION") }</label>
              <input type="text" name="position" onChange={handleChange} onKeyUp={handleValidate} value={form.position} />
          </div>
          <div className="form_item">
              <label>{ language && translate().simpleText("PLAYER_TABLE.ROLE") }</label>
              <input type="text" name="role" onChange={handleChange} onKeyUp={handleValidate} value={form.role} />
          </div>
          <div className="form_item">
              <label>{ language && translate().simpleText("PLAYER_TABLE.TEAM") }</label>
              <input type="text" name="team" onChange={handleChange} onKeyUp={handleValidate} value={form.team} />
          </div>
          <div className="form_item">
              <label>{ language && translate().simpleText("PLAYER_TABLE.TSHIRT_NUMBER") }</label>
              <input type="text" name="tshirt_number" onChange={handleChange} onKeyUp={handleValidate} value={form.tshirt_number} />
          </div>

          <div className="buttons">
              <button type="reset" onClick={handleReset}>{ language && translate().simpleText('BUTTONS.CANCEL') }</button>
              <button type="submit" disabled={invalidForm || loading}>
                { loading && (
                  <div className="wrapper_simple_loader">
                    <span className="simple_loader"></span>
                    <span>{ language && translate().simpleText('BUTTONS.CREATING') }...</span>
                  </div>
                )}
                { !loading && <span>{ language && translate().simpleText('BUTTONS.CREATE') }</span> }
              </button>
          </div>
      </form>
    </div>
  )
}
