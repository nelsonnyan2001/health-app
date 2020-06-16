
import Firebase, { db } from '../database/firebase_config';

function isInToday(inputDateString) {
  var inputDate = new Date(parseInt(inputDateString));
  var today = new Date();
  if (today.setHours(0, 0, 0, 0) == inputDate.setHours(0, 0, 0, 0)) { return true; }
  else { return false; }
}



// Find friends in the database:

const findCurrentLocationOfOther = (userId) => {
  return new Promise((resolve, reject) => {
    db.ref('/user_data').orderByChild("id").equalTo(userId).on("child_added", (snapshot) => {
      resolve(snapshot.val());
    });
  })
}

export const addFriendCustom = (friendName) => {
  return (dispatch) => {

    dispatch({
      type: "ADD_FRIEND_STARTED",
      payload: "Loading"
    });

    findCurrentLocationOfOther(friendName)
      .then(val => {
        dispatch({
          type: "CUSTOM",
          payload: val
        });
      })
      .catch(
        error => dispatch({
          type: "ADD_FRIEND_FAILURE",
          payload: {
            error
          }
        }),
      );

  };
};

// Register users into Firebase Auth and Firestore:

export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_NICKNAME = 'UPDATE_NICKNAME';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
export const GETALLDAILYRECORDS = 'GETALLDAILYRECORDS';
export const GETMEDICINES = 'GETMEDICINES';

export const updateEmail = email => {
  return {
    type: UPDATE_EMAIL,
    payload: email
  }
}

export const updateNickname = nickname => {
  return {
    type: UPDATE_NICKNAME,
    payload: nickname
  }
}

export const updatePassword = password => {
  return {
    type: UPDATE_PASSWORD,
    payload: password
  }
}

export const login = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password } = getState().user
      const response = await Firebase.auth().signInWithEmailAndPassword(email, password)
      console.log("Login info: response.user.uid = " + response.user.uid);
      dispatch(getUser(response.user.uid))
    } catch (e) {
      alert(e)
    }
  }
}

export const getUser = uid => {
  return async (dispatch, getState) => {
    try {
      const user = await db
        .collection('users')
        .doc(uid)
        .get()

      dispatch({ type: LOGIN, payload: user.data() })
    } catch (e) {
      alert(e)
    }
  }
}

export const signup = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password, nickname } = getState().user;
      console.log("The email which is being registering is " + email);
      const response = await Firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log('The returned uid: ' + response.user.uid);
      if (response.user.uid) {
        const user = {
          uid: response.user.uid,
          email: email,
          nickname: nickname
        }

        db.collection('users')
          .doc(response.user.uid)
          .set(user);

        dispatch({ type: SIGNUP, payload: user });

      }
    } catch (e) {
      alert(e);
      throw (e);
    }
  }
}

export const getAllPersonalRecords = (email) => {
  return async (dispatch) => {
    var measuresData = {
      sevenDays: {
        userName: "",
        weight: 0, //kg
        pulse: 0, //100
        blood_pressure: 0,  //100
        sleep: 0, //hours
        steps: 0, //steps
        exercises: 0 //mins
      }
      ,
      all: {
        userName: "",
        weight: 0, //kg
        pulse: 0, //100
        blood_pressure: 0,  //100
        sleep: 0, //hours
        steps: 0, //steps
        exercises: 0 //mins
      },
      today: {
        userName: "",
        weight: 0, //kg
        pulse: 0, //100
        blood_pressure: 0,  //100
        sleep: 0, //hours
        steps: 0, //steps
        exercises: 0 //mins
      }
    }

    try {

      let dailyrecordsRef = db.collection('daily_record');
      let allData = await dailyrecordsRef.where('email', '==', email).get();

      let response = [];

      allData.forEach(doc => {
        response.push(doc.data());
      });
      response.forEach((each) => {

        measuresData.sevenDays.blood_pressure += each.data.blood_pressure;
        measuresData.sevenDays.exercises += each.data.exercises;
        measuresData.sevenDays.pulse += each.data.pulse;
        measuresData.sevenDays.sleep += each.data.sleep;
        measuresData.sevenDays.steps += each.data.steps;
        measuresData.sevenDays.userName = each.data.userName;
        measuresData.sevenDays.weight += each.data.weight;

        if (isInToday(parseInt(each.timestamp))) {

          var dateOfEach = new Date(parseInt(each.timestamp));

          console.log(dateOfEach.getDate());

          measuresData.today.blood_pressure += each.data.blood_pressure;
          measuresData.today.exercises += each.data.exercises;
          measuresData.today.pulse += each.data.pulse;
          measuresData.today.sleep += each.data.sleep;
          measuresData.today.steps += each.data.steps;
          measuresData.today.userName = each.data.userName;
          measuresData.today.weight += each.data.weight;
        }
      });

      dispatch({ type: GETALLDAILYRECORDS, payload: measuresData });


    } catch (e) {
      alert(e);
      throw (e);
    }
  }
}

export const getMedicines = (nickname) => {
  return async (dispatch) => {
    medicines = []
    try {
      let medicinesRef = db.collection('medicines');
      let allData = await medicinesRef.where('nickname', '==', nickname).get();
      allData.forEach(doc => {
        medicines.push(doc.data());
      });
      dispatch({ type: GETMEDICINES, payload: medicines });
    } catch (e) {
      alert(e);
      throw (e);
    }

  }
}