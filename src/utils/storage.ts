export const saveToken = (token: string) =>
    localStorage.setItem('token', token);
  
  export const getToken = () =>
    localStorage.getItem('token');
  
  export const clearToken = () =>
    localStorage.removeItem('token');
  
  export const saveUser = (user: object) =>
    localStorage.setItem('user', JSON.stringify(user));
  
  export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const clearUser = () =>
    localStorage.removeItem('user');