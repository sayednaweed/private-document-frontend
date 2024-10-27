import Echo from "laravel-echo";
// import "./custom.d.ts";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

window.Pusher = Pusher;

export const pvtLaraEcho = () =>
  (window.Echo = new Echo({
    broadcaster: "reverb",
    encrypted: false,
    authEndpoint: import.meta.env.VITE_API_BASE_URL + "/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY) || ""
        }`,
      },
    },
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
  }));

export const laraEcho = (window.Echo = new Echo({
  broadcaster: "reverb",
  encrypted: false,
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
}));

// import Echo from "laravel-echo";

// const echo = new Echo({
//   broadcaster: "pusher",
//   key: import.meta.env.REACT_APP_PUSHER_APP_KEY,
//   cluster: import.meta.env.REACT_APP_PUSHER_APP_CLUSTER,
//   encrypted: true,
// });

// export const subscribeToChannel = (channelName, eventName, callback) => {
//   echo.channel(channelName).listen(eventName, (data) => {
//     callback(data);
//   });
// };
