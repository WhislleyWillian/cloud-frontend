export const TOKEN_KEY = "app-Token";
export const TOKEN_NAME = "app-Name";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
    localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    usernameOut();
};

export const getTokenName = () => localStorage.getItem(TOKEN_NAME);
export const usernameIn = name => {
    localStorage.setItem(TOKEN_NAME, name);
};
export const usernameOut = () => {
    localStorage.removeItem(TOKEN_NAME);
};