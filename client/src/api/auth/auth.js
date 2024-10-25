import { authApi } from '../base.js';

export async function signIn(email, password, remember) {
  return await authApi.post(`/api/account`, {
    email, password, remember
  });
}
