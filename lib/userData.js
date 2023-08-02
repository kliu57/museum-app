// second library to work with the new functionality available from our User API:
// adding, modifying, deleting favourites and history items

import { getToken } from '@/lib/authenticate';

// make PUT request using fetch to /favourites/id route
// if successful, return data; otherwise returns empty array
export async function addToFavourites(id) {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `JWT ${getToken()}`
        }
    });

    if (res.status === 200) {
        let data = await res.json();
        return data;
    } else {
        return [];
    }
}

// make DELETE request using fetch to /favourites/id route
// if successful, return data; otherwise returns empty array
export async function removeFromFavourites(id) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `JWT ${getToken()}`
        }
    });

    if (res.status === 200) {
        let data = await res.json();
        return data;
    } else {
        return [];
    }
}

// make GET request using fetch to /favourites route
// if successful, return data; otherwise returns empty array
export async function getFavourites() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
        method: "GET",
        headers: {
            "Authorization": `JWT ${getToken()}`
        }
    });

    if (res.status === 200) {
        let data = await res.json();
        return data;
    } else {
        return [];
    }
}

// make PUT request using fetch to /history/id route
// if successful, return data; otherwise returns empty array
export async function addToHistory(id) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `JWT ${getToken()}`
        }
    });

    if (res.status === 200) {
        let data = await res.json();
        return data;
    } else {
        return [];
    }
}

// make DELETE request using fetch to /history/id route
// if successful, return data; otherwise returns empty array
export async function removeFromHistory(id) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `JWT ${getToken()}`
        }
    });
  
    if (res.status === 200) {
        let data = await res.json();
        return data;
    } else {
        return [];
    }
}

// make GET request using fetch to /history route
// if successful, return data; otherwise returns empty array
export async function getHistory() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
        method: "GET",
        headers: {
            "Authorization": `JWT ${getToken()}`
        }
    });
    
    if (res.status === 200) {
        let data = await res.json();
        return data;
    } else {
        return [];
    }
}