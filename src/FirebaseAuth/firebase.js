import firebaseConfig from '../secrets';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
export const storage = firebase.storage();

export const database = {
    users: firestore.collection('users'),
    reels: firestore.collection('reels')
}

export default firebase;