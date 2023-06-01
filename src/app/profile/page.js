"use client"

import React, { useEffect } from 'react'

export default function Home() {

  const clientId = "a597c60b87d74f488451670834354d01"; 

   useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access the window object only on the client-side
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      console.log(code);
      
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        if (!localStorage.getItem("token")) {
          getAccessToken(clientId, code)
            .then((accessToken) => fetchProfile(accessToken))
            .then((profile) => populateUI(profile))
            .catch((error) => {
              console.error(error);
            });
        } else {
          fetchProfile(localStorage.getItem("token"))
            .then((profile) => populateUI(profile))
            .catch((error) => {
              console.error(error);
            }
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('token')
      console.log(accessToken);
      if (!accessToken) {
        console.log("No access token found");
      } else {
        fetchTopTracks(accessToken)
          .then((tracks) => console.log(tracks))
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, []);

  async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);
    localStorage.removeItem("token");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000/profile");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  }

  async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/profile");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    console.log(access_token);
    localStorage.setItem("token", access_token);
    return access_token;
  }
  
  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    const profile = await result.json();

    return profile;
  }
  
  function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
  }

  async function fetchTopTracks(token) {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log(data);
    return data.items;
  }

  return (
    <div>
      <h1>Display your Spotify profile data</h1>
      <section id="profile">
      <h2>Logged in as <span id="displayName"></span></h2>
      <span id="avatar"></span>
      <ul>
          <li>User ID: <span id="id"></span></li>
          <li>Email: <span id="email"></span></li>
          <li>Spotify URI: <a id="uri" href="#"></a></li>
          <li>Link: <a id="url" href="#"></a></li>
          <li>Profile Image: <span id="imgUrl"></span></li>
      </ul>
      </section>
    </div>
  )
}
