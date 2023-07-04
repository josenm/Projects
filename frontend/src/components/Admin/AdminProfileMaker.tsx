import React from 'react';
import {
  IonHeader,
  IonItem,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonCheckbox,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

function getMeters(authkey: string) {
  return new Promise(resolve => {

    fetch('https://api.ekmpush.com/meterAuth?key=' + authkey)
      .then(res => resolve(res.json()))
  });
}
type MyModalProps = {
  closeAction: Function;
};

type MyModalStates = {
  name: string;
  email: string;
  number: string;
  key: string;
  password: string;
  nameError: string;
  emailError: string;
  numberError: string;
  passwordError: string;
  configuracionesDelMedidor: any[],
  configuracionesDePerfil: any[],
  checked: boolean,
  meters: any[],
  selectedMeters: any[]
};

let isValid: boolean = false;

export default class AdminProfileMaker extends React.Component<
  MyModalProps,
  MyModalStates
  > {
  //getDatabaseElements();
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);

    this.state = {
      name: '',
      email: '',
      number: '',
      key: '',
      password: '',
      nameError: '',
      emailError: '',
      numberError: '',
      passwordError: '',
      configuracionesDelMedidor: [],
      configuracionesDePerfil: [],
      checked: false,
      meters: [],
      selectedMeters: []
    };
  }

  async componentDidMount() {
    await this.loadMeters();

  }

  loadMeters = async () => {
    const res: any = await getMeters("NjUyMzIwMzA6RXBEQnJOTzg");
    var tempMeterArray = new Array(0);
    res.forEach(element => {
      tempMeterArray.push(element.meter);
    });

    if (res !== null) {
      this.setState({
        meters: tempMeterArray,
      })
    }

  }
  setChecked = (e) => {
    this.setState({
      checked: e,
    })
  }
  updateMeterLists = (e) => {
    this.setState({
      selectedMeters: e
    })

  }
  validateFields = () => {
    const emRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const { name, number, email, password } = this.state;

    let emErr = '';
    if (!emRegex.test(email)) {
      emErr = 'Ingrese un correo válido';
    }
    if (email === '') {
      emErr = 'Campo requerido';
    }

    let passErr = '';
    if (password.length < 6) {
      passErr = 'Contraseña debe tener al menos 6 caractéres';
    }
    if (password === '') {
      passErr = 'Campo requerido';
    }

    this.setState(
      {
        nameError: name === '' ? 'Campo requerido' : '',
        emailError: emErr,
        numberError: number === '' ? 'Campo requerido' : '',
        passwordError: passErr,
      },
      () => {
        if (
          this.state.nameError === '' &&
          this.state.emailError === '' &&
          this.state.numberError === '' &&
          this.state.passwordError === ''
        ) {
          isValid = true;
        } else {
          isValid = false;
        }
      },
    );
  };

  async submit() {
    await this.validateFields();
    if (!isValid) {
      return;
    }
    const { name, email, number, password, configuracionesDelMedidor } = this.state;
    await fetch('https://ekm-teleworks-app-backend.herokuapp.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: name,
        correo: email,
        tel: number,
        pass: password,
        key: '',
        confMeter: JSON.stringify(configuracionesDelMedidor),
        conPerfil: { usuario: name, correo: email, ekmKey: this.state.checked ? "NjUyMzIwMzA6RXBEQnJOTzg" : -1, costoKWH: 1, idioma: "English" },
        medidoresPerm: this.state.checked ? JSON.stringify(this.state.selectedMeters) : JSON.stringify([])

      }),
    })
    window.location.reload(true);


  }

  render() {
    return (
      <>
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Crear Usuario</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => this.props.closeAction()}>
                <IonIcon name="close" slot="icon-only"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="create-form">
          <br />
          <IonItem>
            <IonInput
              type="text"
              required
              placeholder="Nombre *"
              onIonChange={(e: any) => this.setState({ name: e.target.value })}
            />
            <div style={{ color: 'red', fontSize: '10px' }}>
              {this.state.nameError}
            </div>
          </IonItem>
          <br />
          <IonItem>
            <IonInput
              type="text"
              required
              placeholder="Número de teléfono *"
              onIonChange={(e: any) =>
                this.setState({ number: e.target.value })
              }
            />
            <div style={{ color: 'red', fontSize: '10px' }}>
              {this.state.numberError}
            </div>
          </IonItem>
          <br />
          <IonItem>
            <IonInput
              required
              placeholder="Correo electronico *"
              type="email"
              onIonChange={(e: any) => this.setState({ email: e.target.value })}
            />
            <div style={{ color: 'red', fontSize: '10px' }}>
              {this.state.emailError}
            </div>
          </IonItem>
          <br />
          <IonItem>
            <IonInput
              required
              placeholder="Contraseña *"
              type="password"
              onIonChange={(e: any) =>
                this.setState({ password: e.target.value })
              }
            />
            <div style={{ color: 'red', fontSize: '10px' }}>
              {this.state.passwordError}
            </div>
          </IonItem>
          <IonItem>
            <IonLabel >
              El usuario usará la llave EKM de Teleworks
            </IonLabel>
            <IonCheckbox slot="start" checked={this.state.checked} onIonChange={e => this.setChecked(e.detail.checked)} />
          </IonItem>

          <IonItem hidden={!this.state.checked} lines="none">
            <IonLabel>Medidores del usuario </IonLabel>

            <IonSelect multiple onIonChange={(e) => this.updateMeterLists(e.detail.value)} placeholder="Seleccione los medidores" style={{ minWidth: "fit-content" }} >
              {this.state.meters.map((meter, pos) => (
                <IonSelectOption key={meter + pos} value={meter} >{meter}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <br />
          <br />
          <IonButton onClick={this.submit} color="medium" expand="block">
            {' '}
            Crear{' '}
          </IonButton>
        </IonContent>
      </>
    );
  }
}
