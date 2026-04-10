import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

const LOGIN_QUERY = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      success
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apollo = inject(Apollo);

  login(usernameOrEmail: string, password: string) {
    return this.apollo.query<{ login: { success: boolean; message: string; token: string | null; user: unknown } }>({
      query: LOGIN_QUERY,
      variables: {
        input: {
          usernameOrEmail,
          password
        }
      },
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.login ?? { success: false, message: 'Login failed.', token: null, user: null }));
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate<{ signup: { success: boolean; message: string; token: string | null; user: unknown } }>({
      mutation: SIGNUP_MUTATION,
      variables: {
        input: {
          username,
          email,
          password
        }
      },
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.signup ?? { success: false, message: 'Signup failed.', token: null, user: null }));
  }

  logout() {
    return this.apollo.mutate<{ logout: { success: boolean; message: string } }>({
      mutation: LOGOUT_MUTATION,
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.logout ?? { success: true, message: 'Logged out.' }));
  }

  storeSession(token: string | null, user: unknown) {
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(user ?? null));
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
