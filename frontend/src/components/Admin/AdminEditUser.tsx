import React from 'react';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonToast,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { resetPassword } from '../../firebaseConfig';

function getMeters(authkey: string) {
  return new Promise(resolve => {

    fetch('https://api.ekmpush.com/meterAuth?key=' + authkey)
      .then(res => resolve(res.json()))
  });
}


type MyModalProps = {
  closeAction: Function;
  user: any;
};

type MyModalState = {
  name: string;
  email: string;
  number: string;
  id: string;
  showToast: boolean;
  nameError: string;
  numberError: string;
  checked: boolean;
  meters: any[]
  medidoresPermitidos: any[]
};
let isValid: boolean = false;
export default class AdminEditUser extends React.Component<MyModalProps, MyModalState> {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);

    this.state = {
      name: this.props.user.name,
      email: this.props.user.email,
      number: this.props.user.number,
      id: this.props.user.id,
      showToast: false,
      nameError: '',
      numberError: '',
      checked: false,
      meters: [],
      medidoresPermitidos: JSON.parse(this.props.user.medidoresPermitidos),
    };
  }

  async componentDidMount() {
    await this.loadMeters();
    let x = (this.state.medidoresPermitidos && this.state.medidoresPermitidos.length) ? true : false
    this.setState({
      checked: x,
    })

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
      medidoresPermitidos: e
    })

  }

  validateFields = () => {
    const { name, number } = this.state;

    this.setState(
      {
        nameError: name === '' ? 'Campo requerido' : '',
        numberError: number === '' ? 'Campo requerido' : '',
      },
      () => {
        if (this.state.nameError === '' && this.state.numberError === '') {
          isValid = true;
        } else {
          isValid = false;
        }
      },
    );
  };

  handleLinkReset = () => {
    this.setState({ showToast: true });
    resetPassword(this.state.email);
  };

  async submit() {
    console.log(this.state.medidoresPermitidos);

    await this.validateFields();
    if (!isValid) {
      return;
    }
    await fetch('https://ekm-teleworks-app-backend.herokuapp.com/users/' + this.state.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        tel: this.state.number,
        medidoresPerm: this.state.checked ? JSON.stringify(this.state.medidoresPermitidos) : JSON.stringify([]),
        llave: this.state.checked ? 'NjUyMzIwMzA6RXBEQnJOTzg' : ''
      }),
    });
    window.location.reload(true);

  }

  render() {
    //console.log("User:", this.props.user);

    return (
      <>
        <IonHeader>
          <IonToolbar color="success">
            <IonTitle>Editar Usuario</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => this.props.closeAction()}>
                <IonIcon name="close" slot="icon-only"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <br />
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput
              type="text"
              required
              value={this.state.name}
              onIonChange={(e: any) => this.setState({ name: e.target.value })}
            />
            <div style={{ color: 'red', fontSize: '10px' }}>
              {this.state.nameError}
            </div>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="stacked">Numero de telefono</IonLabel>
            <IonInput
              type="number"
              required
              value={this.state.number}
              onIonChange={(e: any) =>
                this.setState({ number: e.target.value })
              }
            />
            <div style={{ color: 'red', fontSize: '10px' }}>
              {this.state.numberError}
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

            <IonSelect value={this.state.medidoresPermitidos} multiple onIonChange={(e) => this.updateMeterLists(e.detail.value)} placeholder="Seleccione los medidores" style={{ minWidth: "fit-content" }} >
              {this.state.meters.map((meter, pos) => (
                <IonSelectOption key={meter + pos} value={meter} >{meter}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <br />

          <IonButton
            expand="block"
            shape="round"
            onClick={this.handleLinkReset}
          >
            Enviar correo para restablecer contraseña
          </IonButton>
          <IonToast
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            message="Correo enviado"
            duration={2000}
          />

          <br />
          <br />

          <IonButton onClick={this.submit} color="medium" expand="block">
            Aceptar
          </IonButton>
        </IonContent>
      </>
    );
  }
}
