import React, { Component } from 'react';
import {
  IonContent,
  IonCol,
  IonRow,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonPage,
  IonTitle,
  IonAlert,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItemOption,
  IonLabel,
  IonModal,
  IonIcon,
  IonFooter,
  IonSpinner,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';

import { signOut } from '../../firebaseConfig';
import './AdminUserList.css';
import AdminEditUser from './AdminEditUser';
import AdminProfileMaker from './AdminProfileMaker';
import SearchBar from './Searchbar';
import Teleworksphoto from '../../Resources/Images/TeleWorksLogo.png';

var arrDel: any[] = [];
export default class AdminUsersList extends Component<
  {},
  {
    users: Array<any>;
    filteredUsers: Array<any>;
    showModalCreate: boolean;

    deleteModal: Array<any>;
    editModal: boolean;
    showDeleteAlert: boolean;
    isMounting: boolean;
    currentUser: any;
  }
  > {
  constructor(props) {
    super(props);

    this.closeModalCreate = this.closeModalCreate.bind(this);

    this.onOpenModalEdit = this.onOpenModalEdit.bind(this);
    this.onCloseModalEdit = this.onCloseModalEdit.bind(this);

    this.onOpenDeleteAlert = this.onOpenDeleteAlert.bind(this);
    this.onCloseDeleteAlert = this.onCloseDeleteAlert.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      users: [],
      filteredUsers: [],
      showModalCreate: false,

      deleteModal: [],
      editModal: false,
      showDeleteAlert: false,
      isMounting: true,
      currentUser: null,
    };
  }

  fetchData = () => {
    fetch('https://ekm-teleworks-app-backend.herokuapp.com/users', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((dataJSON) => {
        return JSON.stringify(dataJSON);
      })
      .then((strJSON) => {
        this.setState({
          users: JSON.parse(strJSON),
          filteredUsers: JSON.parse(strJSON),
          isMounting: false,
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  /* componentDidUpdate() {
    this.fetchData();
  } */

  closeModalCreate() {
    this.setState({
      showModalCreate: false,
    });
  }

  handleSetData = (data) => {
    this.setState({ filteredUsers: data });
  };

  onOpenModalEdit(ind, user) {
    //console.log('index', ind);
    /* for (var a = 0; a < this.state.users.length; a++) {
      arrEdit.push(false);
    }

    arrEdit[ind] = true;
    //console.log('arr', arrEdit); */
    this.setState({ editModal: true, currentUser: user });
  }

  onCloseModalEdit() {
    /*  arrEdit = [];
    for (var a = 0; a < this.state.users.length; a++) {
      arrEdit.push(false);
    } */
    this.setState({ editModal: false, currentUser: null });
  }

  onOpenDeleteAlert(ind) {
    for (var a = 0; a < this.state.users.length; a++) {
      arrDel.push(false);
    }
    arrDel[ind] = true;

    this.setState({ deleteModal: arrDel });
  }

  onCloseDeleteAlert() {
    arrDel = [];
    for (var a = 0; a < this.state.users.length; a++) {
      arrDel.push(false);
    }
    this.setState({ deleteModal: arrDel });
  }

  async deleteUser(id) {
    //console.log('idss', id);
    await fetch('https://ekm-teleworks-app-backend.herokuapp.com/users/' + id, {
      method: 'DELETE',
    })
    window.location.reload(true);
  }

  showData = () => {
    const { filteredUsers, deleteModal } = this.state;
    if (filteredUsers === null) {
      return;
    }

    return Object.values(filteredUsers).map((user: any, index: number) => {
      return (
        <IonItemSliding key={index}>
          <IonItem>
            <IonLabel>
              <IonRow className="rows">
                <IonCol size="4"><IonRow id="userRow">{user.name}</IonRow> </IonCol>
                <IonCol size="4"><IonRow id="userRow">{user.number} </IonRow></IonCol>
                <IonCol size="4"><IonRow id="userRow">{user.email}</IonRow></IonCol>
              </IonRow>
            </IonLabel>
          </IonItem>
          <IonItemOptions>
            <IonItemOption
              className="editBtn"
              onClick={() => {
                this.onOpenModalEdit(index, user);
              }}
            >
              Editar
            </IonItemOption>

            <IonItemOption
              className="deleteBtn"
              onClick={() => {
                this.onOpenDeleteAlert(index);
              }}
            >
              Borrar
            </IonItemOption>
            <IonAlert
              isOpen={deleteModal[index]}
              onDidDismiss={this.onCloseDeleteAlert}
              header={'Borrar Usuario'}
              message={'Desea borrar este usuario?'}
              buttons={[
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    //console.log('Confirm Cancel: blah');
                  },
                },
                {
                  text: 'Aceptar',
                  handler: () => {
                    this.deleteUser(user.id);
                  },
                },
              ]}
            />
          </IonItemOptions>
        </IonItemSliding>
      );
    });

    // return arr;
  };

  render() {
    const { showModalCreate } = this.state;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar className="header">
            <IonButtons slot="start">
              <IonButton onClick={signOut}>
                <span className="signout">Salir</span>
                <IonIcon
                  className="signout-app"
                  slot="start"
                  icon={logOutOutline}
                  size="10"
                />
              </IonButton>
            </IonButtons>
            <IonTitle style={{ textAlign: 'center' }}>
              Lista de Usuarios
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                onClick={() => this.setState({ showModalCreate: true })}
              >
                <span className="button-text">+ Crear Usuario</span>
                <span className="button-text-app">+</span>
              </IonButton>
              <IonModal isOpen={showModalCreate} backdropDismiss={false}>
                <AdminProfileMaker
                  closeAction={this.closeModalCreate}
                ></AdminProfileMaker>
              </IonModal>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <SearchBar
            data={
              this.state.users === null ? null : Object.values(this.state.users)
            }
            handleSetData={this.handleSetData}
          />
          <IonRow className="tableHeader">
            <IonCol>Nombre</IonCol>
            <IonCol>Teléfono</IonCol>
            <IonCol>Correo</IonCol>
          </IonRow>
          {this.state.isMounting && (
            <IonSpinner
              className="load-spinner"
              name="crescent"
              color="#D8D8D8"
            />
          )}
          {this.showData()}
        </IonContent>
        <IonModal
          isOpen={this.state.editModal}
          backdropDismiss={false}
          onDidDismiss={this.onCloseModalEdit}
        >
          <AdminEditUser
            closeAction={this.onCloseModalEdit}
            user={this.state.currentUser}
          ></AdminEditUser>
        </IonModal>
        <IonFooter>
          <img alt="" className="logo" src={Teleworksphoto} />
        </IonFooter>
      </IonPage>
    );
  }
}
