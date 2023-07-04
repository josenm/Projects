import React from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonCard,
  IonCardTitle,
  IonItem,
  IonIcon,
  IonAlert,
  IonToast,
} from '@ionic/react';
import { loginUser, resetPassword } from '../firebaseConfig';
import { presentToast } from '../toast';
import Teleworksphoto from '../Resources/Images/TeleWorksLogo.png';
import './Login.css';
import { mail, keySharp } from 'ionicons/icons';

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    showResetLogin: false,
    showSignUp: false,
    usernameReset: '',
    showToast: false,
  };
  // const[username, setUsername] = useState("");
  // const[password, setPassword] = useState("");

  login = async () => {
    const res = await loginUser(this.state.username, this.state.password);

    if (!res) {
      presentToast('User or password were incorrect');
    }
  };
  setUsername = (x: string) => {
    this.setState({
      username: x,
    });
  };

  setPassword = (x: string) => {
    this.setState({
      password: x,
    });
  };

  handleLinkReset = () => {
    const { usernameReset } = this.state;
    ////console.log('correo', usernameReset);

    if (usernameReset === '') {
      return;
    }
    this.setState({ showToast: true });
    resetPassword(this.state.usernameReset);
    this.handleCloseResetLink();
  };

  handleOpenResetLink = () => {
    this.setState({
      showResetLogin: true,
    });
  };

  handleCloseResetLink = () => {
    this.setState({
      showResetLogin: false,
    });
  };

  handleOpenSignUpLink = () => {
    this.setState({
      showSignUp: true,
    });
  };

  handleCloseSignUpLink = () => {
    this.setState({
      showSignUp: false,
    });
  };

  onChangeReset = (x: string) => {
    this.setState({
      usernameReset: x,
    });
  };

  render() {
    return (

      <IonPage className="Login" >
        <IonContent id="ionBackground" className="ion-padding Login" onClick={(evt) => evt.preventDefault()}>
          <IonCard  >
            <IonCardTitle>Login</IonCardTitle>
            <img alt="" id="logo" src={Teleworksphoto} />
            <IonItem>
              <IonIcon slot="start" size="medium" icon={mail}></IonIcon>
              <IonInput
                placeholder="Email"
                onIonChange={(e: any) => this.setUsername(e.target.value)}
                type="email"
                required={true}
              />
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={keySharp}></IonIcon>
              <IonInput
                placeholder="Password"
                type="password"
                required={true}
                onIonChange={(e: any) => this.setPassword(e.target.value)}
              />
            </IonItem>
            <IonButton
              color="secondary"
              className="botonLogin"
              onClick={this.login}
            >
              {' '}
              Sign In
            </IonButton>
            {/* <IonButton
              className="botonLogin"
              style={{
                fontSize: '12px',
                borderRadius: '8px',
              }}
              onClick={this.handleOpenSignUpLink}
            >
              Sign Up
            </IonButton> */}
            <IonButton
              color="tertiary"
              className="botonLogin"
              style={{
                fontSize: '14px',
                borderRadius: '8px',
              }}
              onClick={this.handleOpenResetLink}
            >
              Forgot Password
            </IonButton>
            <IonAlert
              isOpen={this.state.showResetLogin}
              onDidDismiss={this.handleCloseResetLink}
              cssClass="my-custom-class"
              header={'Reset Password'}
              inputs={[
                {
                  name: 'email',
                  type: 'email',
                  placeholder: 'Email',
                },
              ]}
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    this.handleCloseResetLink();
                  },
                },
                {
                  text: 'Send',
                  handler: (alertData) => {
                    this.setState({ usernameReset: alertData.email });
                    this.handleLinkReset();
                  },
                },
              ]}
            />
            <IonAlert
              isOpen={this.state.showSignUp}
              onDidDismiss={this.handleCloseResetLink}
              cssClass="my-custom-class"
              header={'Sign Up'}
              inputs={[
                {
                  name: 'email',
                  type: 'email',
                  placeholder: 'Email',
                },
                {
                  name: 'password',
                  type: 'password',
                  placeholder: 'Password',
                },
              ]}
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    this.handleCloseSignUpLink();
                  },
                },
                {
                  text: 'Register',
                  handler: () => {
                    // this.setState({ usernameReset: alertData.email });
                    // this.handleLinkReset();
                  },
                },
              ]}
            />
            <IonToast
              isOpen={this.state.showToast}
              onDidDismiss={() => this.setState({ showToast: false })}
              message="If a valid account is linked to that email it will receive a link to reset the password. Remember to check the Spam folder if you did not receive an email."
              duration={10000}
            />
          </IonCard>

        </IonContent>

      </IonPage>

    );
  }
}

export default Login;
