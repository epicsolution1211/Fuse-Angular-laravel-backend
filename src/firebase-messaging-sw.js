importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");
// importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-database.js");
// importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-auth.js");


{/* <script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-database.js"></script> */ }


firebase.initializeApp({
    apiKey: "AIzaSyD44f7J_K-SWvYA4459PhZPxXjSjFCijvw",
    authDomain: "refund-19eb1.firebaseapp.com",
    databaseURL: "https://refund-19eb1.firebaseio.com",
    projectId: "refund-19eb1",
    storageBucket: "refund-19eb1.appspot.com",
    messagingSenderId: "988562864253",
    appId: "1:988562864253:web:a8a8f00c9b8d19c03ed914",
    measurementId: "G-G8BC26RTDN"
});


const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            windowClient.postMessage(payload);
        }
    }).then(() => {
        const notificationTitle = payload.data.title;
        const notificationOptions = {
            body: payload.data.body,
            icon: 'assets/images/push.png',
            sound: 'default'
        };
        return self.registration.showNotification(notificationTitle, notificationOptions);
    });
    return promiseChain;
});

self.addEventListener('notificationclick', function (event) {
    // console.log("event>>>>>>", event)
    const urlToOpenNew = new URL('/r/orders/new', self.location.origin).href;
    const urlToOpenOngoing = new URL('/r/orders/ongoing', self.location.origin).href;
    const urlToOpenCompleted = new URL('/r/orders/completed', self.location.origin).href;
    const urlToOpenMenu = new URL('/r/menu', self.location.origin).href;
    const urlToOpenProfile = new URL('/r/profile', self.location.origin).href;
    const urlToOpenReport = new URL('/r/report', self.location.origin).href;
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.url === urlToOpenNew) {
                matchingClient = windowClient;
                break;
            }
            if (windowClient.url === urlToOpenOngoing) {
                matchingClient = windowClient;
                break;
            }
            if (windowClient.url === urlToOpenCompleted) {
                matchingClient = windowClient;
                break;
            }
            if (windowClient.url === urlToOpenProfile) {
                matchingClient = windowClient;
                break;
            }
            if (windowClient.url === urlToOpenReport) {
                matchingClient = windowClient;
                break;
            }
            if (windowClient.url === urlToOpenMenu) {
                matchingClient = windowClient;
                break;
            }
        }
        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return clients.openWindow(urlToOpenNew);
        }
    });
    event.waitUntil(promiseChain);
});
