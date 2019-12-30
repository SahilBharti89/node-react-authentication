// const TOKEN_KEY = localStorage.getItem('JWT');

// export const login = () => {
//     localStorage.setItem(TOKEN_KEY, 'TestLogin');
// }

export const logout = () => {
    localStorage.removeItem('JWT');
}

export const isLogin = () => {
    if (localStorage.getItem('JWT')) {
        console.log('jwt token', localStorage.getItem('JWT'))
        return true;
    }

    return false;
}