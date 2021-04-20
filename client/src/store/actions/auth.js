import actionTypes from './actionsTypes';
import axios from 'axios';

// SIGN IN - REGISTER START
// agrega un loading
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

// CORRECT AUTH - guarda token y user id
export const authSuccess = (token, userId, username) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
        username: username
    }
}
// INCORRECT AUTH - guarda error
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

// LOGOUT
// remover del localStorage y del state
export const logout = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    };
};

// const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('expirationDate');
// };

// CORRECT LOGOUT
export const logoutSucceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

// CHECK AUTH EXPIRATION TIME
export const checkAuthTimeout = (expirationTime) => {
    return {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTime: expirationTime
    };
};

// functions
export const auth = (userData, isSignUp) => {
    let url = 'http://127.0.0.1:4001/users/login';
    if (isSignUp) {
        url = 'http://127.0.0.1:4001/users/';
    }
    return dispatch => {
        dispatch(authStart());
        axios.post(url, userData)
			.then(response => {
				// expiresIn info dada por la db de cuando expira el token
				// const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                console.log(response);
				localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.user_id);
                // localStorage.setItem('username', authUsername);
				// localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(response.data.token, response.data.user_id, response.data.username));
			}).catch((error) => {
				console.log(error);
                dispatch(authFail(error));
			});
    };
};

export const authCheckState = () => {
    const token = localStorage.getItem('token');
    return dispatch => {
        if (!token) {
            logout();
        } else {
            // const expirationDate = new Date(localStorage.getItem('expirationDate'));
            // if( expirationDate > new Date ()){
                const userId =  localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
            //     dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            // } else {
            //     logout();
            // }
        }
        // type: actionTypes.AUTH_CHECK_STATE
    }
};