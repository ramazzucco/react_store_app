import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editUser, getDetail } from '../../user.service';
import { translate } from '../../../../i18n/translate';
import userEditStore from '../../../../_store/user-edit-store';
import appStore from '../../../../_store/app-store';

import './edit.css';

export default function EditUser() {
  const [detail, setDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [language, setLanguage] = React.useState({});
  const [form, setForm] = React.useState({
    _id: '',
    age: 0,
    fullname: '',
    position: '',
    role: '',
    team: '',
    tshirt_number: 0,
  });
  const [invalidForm, setInvalidForm] = React.useState(true);

  const params = useParams();
  const navigate = useNavigate();

  const _getDetail = async (id) => {
    await getDetail(id);
  }

  useEffect(() => {
    if(!detail) userEditStore.userDetailState$.subscribe((_detail) =>  {
      if(_detail && _detail.value) {
        setDetail(_detail.value)
        setForm({
          _id: _detail.value._id,
          age: Number(_detail.value.age),
          fullname: _detail.value.fullname,
          position: _detail.value.position,
          role: _detail.value.role,
          team: _detail.value.team,
          tshirt_number: Number(_detail.value.tshirt_number),
        });
        setInvalidForm(false);
      }
    });
    appStore.languageState$.subscribe(state => state && setLanguage(state.value));
    _getDetail(params.id);
    userEditStore.userEdited$.subscribe((editedSuccess) => {
      if(editedSuccess) navigate('/player/' + editedSuccess.value.team);
    });
    userEditStore.userEditError$.subscribe(error => {
      if(error) setLoading(false);
    });
    return () => {
      userEditStore.userDetailState$.next({
        action: "RESET",
        name: userEditStore.userEditStateName,
        value: null,
      });
      userEditStore.userEdited$.next(false);
      userEditStore.userEditError$.next(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invalidForm) {
      setLoading(true);
      await editUser(form);
    }
  }

  const handleReset = (e) => {
    setForm({
      _id: detail && detail._id,
      age: detail && detail.age,
      fullname: detail && detail.fullname,
      position: detail && detail.position,
      role: detail && detail.role,
      team: detail && detail.team,
      tshirt_number: detail && detail.tshirt_number,
    });
  }

  return (
    <div className='page edit_user'>
      <h1>{ language && translate().textWithParams('PLAYER_EDIT.TITLE', {fullname: detail ? detail.fullname : ''}) }</h1>

      <form onSubmit={handleSubmit}>
          <div className="form_item">
              <label>{ language && translate().simpleText("PLAYER_TABLE.FULLNAME")}</label>
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
                    <span>{ language && translate().simpleText('BUTTONS.EDITING') }...</span>
                  </div>
                )}
                { !loading && <span>{ language && translate().simpleText('BUTTONS.EDIT') }</span> }
              </button>
          </div>
      </form>
    </div>
  )
}
