import axios from 'axios';
import { useEffect } from 'react';
import type { AppUser, AppUserType } from '../types/AppUser.ts';
import CustomButton from './CustomButton.tsx';

type OAuthProps = AppUser;

function getOpen() {
  return window.location.host === 'localhost:5173'
    ? 'http://localhost:8080'
    : window.location.origin;
}

function login() {
  window.open(getOpen() + '/oauth2/authorization/github', '_self');
}

function logout() {
  window.open(getOpen() + '/logout', '_self');
}

export default function OAuth(props: Readonly<OAuthProps>) {
  function loadUser() {
    if (!props.user?.name) {
      axios
        .get<AppUserType>('api/auth/me')
        .then((r) => {
          props.setUser({
            name: r.data.name ? r.data.name : undefined,
            role: r.data.role ? r.data.role : undefined,
          });
        })
        .catch((e) => {
          props.setUser(undefined);
          console.error(e);
        });
    }
  }

  useEffect(() => {
    if (!props.user?.name) {
      loadUser();
    }
  });

  return (
    <div>
      {props.user?.name && (
        <>
          <span className={'mr-5'}>
            Hallo <span dangerouslySetInnerHTML={{ __html: props.user?.name }}></span>
          </span>
          <CustomButton onClick={logout} title={'Logout'}>
            Logout
          </CustomButton>
        </>
      )}
      {!props.user?.name && (
        <CustomButton onClick={login} title={'Login'}>
          Login
        </CustomButton>
      )}
    </div>
  );
}
