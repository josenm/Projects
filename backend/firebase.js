var admin = require("firebase-admin");

var serviceAccount = require("./teleworks-prod-firebase-adminsdk-xgs1x-13e04b433d.json");

var defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), //admin.credential.cert(),
  databaseURL: "https://teleworks-prod-default-rtdb.firebaseio.com",
});
//  privateKey: file.private_key,
//   clientEmail: file.client_email,
//   projectId: file.project_id,
// }process.env

var defaultAuth = defaultApp.auth();
var defaultDatabase = defaultApp.database();

async function loginUser(username, password) {
  // const email = `${username}@teleworks.com`;
  try {
    const res = await defaultAuth.signInWithEmailAndPassword(
      username,
      password
    );
    return true;
  } catch (error) {
    ////console.log(error);
    return false;
  }
}

function signUser(req, res) {
  const {
    nombre,
    correo,
    tel,
    pass,
    key,
    confMeter,
    conPerfil,
    medidoresPerm,
  } = req.body;
  const id = defaultAuth
    .createUser({ email: correo, password: pass })
    .then((rec) => {
      return rec.uid;
    });
  id.then((val) => {
    const done = createUser(
      nombre,
      correo,
      tel,
      pass,
      key,
      val,
      confMeter,
      conPerfil,
      medidoresPerm
    );
    return res.status(200).send(done);
  });
}

function createUser(
  nombre,
  correo,
  tel,
  pass,
  key,
  id,
  confMeter,
  conPerfil,
  medidoresPerm
) {
  const dbRef = defaultDatabase.ref("users/");
  dbRef.child(id).set({
    id: id,
    name: nombre,
    email: correo,
    number: tel,
    password: pass,
    key: key,
    configuracionesDelMedidor: confMeter,
    configuracionesDePerfil: conPerfil,
    medidoresPermitidos: medidoresPerm,
  });
  return "Added User";
}

async function getCurrentUser() {
  try {
    const res = await defaultAuth;
    return res;
  } catch (error) {
    ////console.log("err: ", error);
  }
}

async function signOut() {
  try {
    const res = await defaultAuth.signOut();
    //isSignedIn();
    ////console.log("res: ", res);
    window.location.href = "/";
    ////console.log("out");
    return res;
  } catch (error) {
    ////console.log("err: ", error);
  }
}

async function isSignedIn() {
  try {
    const res = await defaultAuth.onAuthStateChanged((user) => {
      if (user.email === undefined) {
        ////console.log("not signed in");
        return false;
      }
      ////console.log("yes signed in");
      return true;
    });
  } catch (error) {
    ////console.log("err: ", error);
  }
}

function getDatabaseElements(req, res) {
  var ref = defaultDatabase.ref("/users");
  return ref.once("value", function (snapshot) {
    return res.status(200).json(snapshot.val());
  });
}

async function getCurrentUserName() {
  try {
    var userInfoFromDB = await defaultDatabase.ref("users/");
    var currUser = await defaultAuth.currentUser;
    userInfoFromDB.once("value").then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        if (childData.email === currUser.email) {
          ////console.log("child: ", childData);
          return childData;
        }
      });
    });
  } catch (error) {
    ////console.log("err: ", error);
  }
}

function deleteUserDB(req, res) {
  const id = req.params.id;
  var userRef = defaultDatabase.ref("users/");
  userRef.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      if (childData.id === id) {
        defaultDatabase
          .ref("users/" + childData.id)
          .remove()
          .then((ans) => {
            const data = deleteUserAUTH(id);
            return res.status(200).send(ans);
          });
      }
    });
  });
}

function deleteUserAUTH(id) {
  defaultAuth.deleteUser(id);
  return "Deleted";
}

function updateUser(req, res) {
  const id = req.params.id;
  const { name, tel, medidoresPerm, llave } = req.body;
  var usersRef = defaultDatabase.ref("users/");
  var currUserRef = usersRef.child(id);
  currUserRef.update({
    name: name,
    number: tel,
    medidoresPermitidos: medidoresPerm,
    key: llave,
  });
  return res.status(200).send("Updated");
}

module.exports = {
  loginUser,
  signUser,
  getCurrentUser,
  signOut,
  isSignedIn,
  getDatabaseElements,
  createUser,
  getCurrentUserName,
  updateUser,
  deleteUserDB,
  deleteUserAUTH,
};
