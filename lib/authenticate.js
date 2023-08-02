import jwt_decode from "jwt-decode";

// used to store the token
// used by authenticateUser
function setToken(token) {
    localStorage.setItem('access_token', token);
}

// retrieves token from localStorage using getItem()
// if token does not exist, returns null
export function getToken() {
    try {
        return localStorage.getItem('access_token');
    } catch (err) {
        return null;
    }
}

// obtains payload from JWT (data digitally signed on our server ie. "_id" and "userName")
export function readToken() {
    try {
        const token = getToken();
        return token ? jwt_decode(token) : null;
    } catch (err) {
        return null;
    }
}

// determines whether current user is authenticated
// returns true if user is authenticated, false otherwise
export function isAuthenticated() {
    const token = readToken();   // attempt to read token
    return (token) ? true : false;    // checks if value was returned
}

// removes token from localStorage using removeItem()
export function removeToken() {
    localStorage.removeItem('access_token');
}

// attempts to obtain a JWT from our user-api server at https://wild-erin-ant-robe.cyclic.cloud/api/user/login,
// given a specific user and password
// must be async since it uses the async fetch() function
// must only store token locally if status code from server is 200
// otherwise the function must throw a new Error with the error message sent form the API
export async function authenticateUser(user, password) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ userName: user, password: password }),
        headers: {
            "content-type": "application/json"
        }
    });

    let data = await res.json();

    if (res.status === 200) {
        setToken(data.token);
        return true;
    } else {
        throw new Error(data.message);
    }
}

// attempts to obtain a JWT from our user-api server at https://wild-erin-ant-robe.cyclic.cloud/api/user/register,
// given a specific user, password, and password2
// must be async since it uses the async fetch() function
// if status code from server is 200, does NOT store token locally 
// otherwise the function must throw a new Error with the error message sent form the API
export async function registerUser(user, password, password2) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ userName: user, password: password, password2: password2 }),
        headers: {
            "content-type": "application/json"
        }
    });

    let data = await res.json();

    if (res.status === 200) {
        return true;
    } else {
        throw new Error(data.message);
    } 
  }