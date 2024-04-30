// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    // apiUrl: 'http://127.0.0.1:8000/api',
    // apiUrl: 'https://devapanel.atavismonline.com/backend/public/api',
    //cors-anywhere
    apiUrl: 'http://localhost:8000/api',
    production: false,
    base_path: '',

    firebase: {
        apiKey: "AIzaSyD44f7J_K-SWvYA4459PhZPxXjSjFCijvw",
        authDomain: "refund-19eb1.firebaseapp.com",
        databaseURL: "https://refund-19eb1.firebaseio.com",
        projectId: "refund-19eb1",
        storageBucket: "refund-19eb1.appspot.com",
        messagingSenderId: "988562864253",
        appId: "1:988562864253:web:a8a8f00c9b8d19c03ed914",
        measurementId: "G-G8BC26RTDN"
    },

    pusher: {
        production: false,
        key: '87eda81787f7b9f298ad',
        cluster: 'ap2',
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
