import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyASH_MROf9zkXV1y7kRYcP6-kyH6kOzAkE',
  authDomain: 'teleworks-prod.firebaseapp.com',
  databaseURL: 'https://teleworks-prod-default-rtdb.firebaseio.com',
  projectId: 'teleworks-prod',
  storageBucket: 'teleworks-prod.appspot.com',
  messagingSenderId: '686422150974',
  appId: '1:686422150974:web:ec94521abe14601238a66f',
  measurementId: 'G-5PXZP0WHG6',
};

firebase.initializeApp(config);

export async function loginUser(username: string, password: string) {
  // const email = `${username}@teleworks.com`;
  try {
    await firebase.auth().signInWithEmailAndPassword(username, password);
    return true;
  } catch (error) {
    ////console.log(error);
    return false;
  }
}

export async function signUser(username: string, password: string) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(username, password);
    return true;
  } catch (error) {
    ////console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const res = await firebase.auth();
    return res;
  } catch (error) {
    ////console.log('err: ', error);
  }
}

export async function signOut() {
  try {
    const res = await firebase.auth().signOut();
    //isSignedIn();
    ////console.log('res: ', res);
    window.location.href = '/';
    ////console.log('out');
    return res;
  } catch (error) {
    ////console.log('err: ', error);
  }
}

export async function isSignedIn() {
  try {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user?.email === undefined) {
        ////console.log('not signed in');
        return false;
      }
      ////console.log('yes signed in');
      return true;
    });
  } catch (error) {
    ////console.log('err: ', error);
  }
}

export async function getDatabaseElements() {
  try {
    const dbRef = await firebase.database().ref().child('users');
    //dbRef.on('value', val => res.status(200).json({"users":snap.val()}));
    return dbRef.once('value');
  } catch (error) {
    ////console.log('err: ', error);
  }
}

export async function updateConfiguraciones(
  uid: string,
  configuracionesDelMedidor: string,
) {
  const dbRef = await firebase.database().ref('users/' + uid);
  dbRef.update({ configuracionesDelMedidor });
}

export async function updatePerfil(uid: string, configuracionesDePerfil: {}) {
  const dbRef = await firebase.database().ref('users/' + uid);
  dbRef.update({ configuracionesDePerfil });
}

export async function createUser(
  nombre,
  correo,
  tel,
  pass,
  key,
  confMeter,
  conPerfil,
) {
  try {
    const dbRef = await firebase.database().ref('users/');
    dbRef.push({
      name: nombre,
      email: correo,
      number: tel,
      password: pass,
      key: key,
      configuracionesDelMedidor: confMeter,
      configuracionesDePerfil: conPerfil,
    });
  } catch (error) {
    ////console.log('err: ', error);
  }
}

export async function getCurrentUserData(): Promise<any> {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(async function (user) {
      resolve(
        firebase
          .database()
          .ref('/users/')
          .orderByChild('email')
          .equalTo(user?.email!)
          .once('value')
          .then(function (snapshot) {
            ////console.log(snapshot.val());

            return snapshot.val();
          }),
      );
    });
  });
}

export async function resetPassword(email) {
  ////console.log('email', email);
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {})
    .catch((err) => {
      ////console.log('err', err);
    });
}

export async function getUsuario(): Promise<any> {
  // return new Promise((resolve) => {
  //   firebase.auth().onAuthStateChanged(function (user) {
  //     ////console.log('GetUsuario User:', user);
  //     // if (user) {
  //     //   resolve(user);
  //     // } else {
  //     //   resolve(null
  //     // }
  //   });
  // });
}

export const auth = firebase.auth;
