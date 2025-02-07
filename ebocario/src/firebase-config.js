import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAxXuCL5iflrYO5CMTEWj-9iqH7KIvL5hs",
    authDomain: "ebocario.firebaseapp.com",
    projectId: "ebocario",
    storageBucket: "ebocario.appspot.com",
    messagingSenderId: "478308429824",
    appId: "1:478308429824:web:19b55f16e4ac4a7c9c28e5"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export default app;
