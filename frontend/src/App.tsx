import Menu from './components/Menu';
// import DashboardContainer from './components/DashboardContainer';
import DashboardPage from './pages/DashboardPage';
import MeterInfoContainer from './components/MeterInfoContainer';
import Configuraciones from './components/Configuraciones';
import Profile from './components/Profile';
import Login from './components/Login';
import React, { Component } from 'react';
import AdminProfileMaker from './components/Admin/AdminProfileMaker';
import AdminUsersList from './components/Admin/AdminUsersList';
import { IonApp, IonContent, IonRouterOutlet, IonSpinner, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import { PrivateRoute } from './Routes'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {
  auth,
  getCurrentUserData,
  updateConfiguraciones,
  updatePerfil,
} from './firebaseConfig';

interface FirebaseProviderProps { }
interface FirebaseProviderState {
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  confPerfil: {
    costoKWH: any;
    correo: any;
    ekmKey: any;
    usuario: any;
    idioma: any;
  };
  confMedidores: any[];
  allowedMeters: any[];
  userId: string;
}

interface IFirebaseContext extends FirebaseProviderState { setArrDeConfiguraciones: Function, setProfileConfiguracionesHandler: Function }

export const FirebaseContext = React.createContext<IFirebaseContext | null>(null);
export class FirebaseProvider extends React.Component<
  FirebaseProviderProps,
  FirebaseProviderState
  > {

  constructor(props: FirebaseProviderProps) {
    super(props);
    this.state = {
      loading: true,
      isAuthenticated: false,
      isAdmin: false,
      confPerfil: {
        costoKWH: null,
        ekmKey: null,
        usuario: null,
        correo: null,
        idioma: null,
      },
      confMedidores: [],
      allowedMeters: [],
      userId: "",
    };
  }
  componentDidMount() {
    auth().onAuthStateChanged(async (user: any) => {
      let isAdmin = false;
      const loading = false;
      let isAuthenticated = false;
      if (!user) {
        this.setState({ isAuthenticated, loading, isAdmin });
        return;
      }
      isAuthenticated = true;
      if (user.email === "admin@admin.com") {
        isAdmin = true;
      }
      ////console.log("calling get curr");

      const res: any = await getCurrentUserData();
      this.setState({
        isAuthenticated,
        loading,
        isAdmin,

      });
      if (!isAdmin) {
        // console.log(Object.keys(res)[0]);

        this.setState({
          confPerfil: res[Object.keys(res)[0]]["configuracionesDePerfil"],
          confMedidores: JSON.parse(
            res[Object.keys(res)[0]]["configuracionesDelMedidor"]
          ),
          allowedMeters: JSON.parse(
            res[Object.keys(res)[0]]["medidoresPermitidos"]
          ),
          userId: Object.keys(res)[0],

        })
      }

      if (isAuthenticated && window.location.pathname === "/") {
        ////console.log("AUthenticated");
        if (isAdmin) {
          ////console.log("Admin");
          window.location.href = "/admin/usuarios";
        } else {
          ////console.log("uSER");
          window.location.href = "/medicion/Dashboard";
        }
      }
    });
  }
  setArrDeConfiguraciones = async (arregloactualizado) => {
    this.setState({
      confMedidores: arregloactualizado,
    });

    await updateConfiguraciones(
      this.state.userId,
      JSON.stringify(arregloactualizado)
    );
  };

  setProfileConfiguracionesHandler = async (perfilactualizado) => {

    this.setState({
      confPerfil: perfilactualizado,
    });

    await updatePerfil(this.state.userId, perfilactualizado);
  };
  render() {
    return (
      <FirebaseContext.Provider
        value={{
          ...this.state,
          setProfileConfiguracionesHandler: this.setProfileConfiguracionesHandler,
          setArrDeConfiguraciones: this.setArrDeConfiguraciones

        }}
      >
        {this.props.children}
      </FirebaseContext.Provider>
    );
  }
}


interface AppProps { }
interface AppState {
  selectedMeter: number;
  confMedidoresUpdate: []
}


class App extends Component<AppProps, AppState> {
  static contextType = FirebaseContext;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      selectedMeter: -1,
      confMedidoresUpdate: [],
    };
  }

  setCurrentMedidor = (medidorNumber) => {
    this.setState({
      selectedMeter: medidorNumber,
    });
  };


  getSelectedMeter = () => {
    return this.state.selectedMeter;
  };
  getArrDeConfiguraciones = () => {
    return this.context.confMedidores;
  };


  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <Menu language={this.context.confPerfil.idioma} />
          <IonSplitPane contentId="main">
            <IonRouterOutlet id="main">
              <Route path="/" component={Login} exact />
              <PrivateRoute
                path="/medicion/Dashboard"
                render={() => {
                  return (
                    <DashboardPage
                      setMeter={this.setCurrentMedidor}
                      arrConfiguraciones={this.getArrDeConfiguraciones}
                      arrAllowedMeters={this.context.allowedMeters}
                      ekmKey={this.context.confPerfil.ekmKey}
                      costoKwh={this.context.confPerfil.costoKWH}
                      lenguaje={this.context.confPerfil.idioma}

                    />
                  );
                }}
                authenticated={this.context.isAuthenticated}
                isAdmin={this.context.isAdmin}
                exact
              />
              <PrivateRoute
                path="/medicion/InformaciondelMedidor"
                render={() => {
                  return (
                    <MeterInfoContainer
                      lenguaje={this.context.confPerfil.idioma}
                      getarrDeConfiguraciones={this.getArrDeConfiguraciones}
                      getSelectedMeter={this.getSelectedMeter}
                      ekmKey={this.context.confPerfil.ekmKey}
                    />
                  );
                }}
                authenticated={this.context.isAuthenticated}
                isAdmin={this.context.isAdmin}
                exact
              />
              <PrivateRoute
                path="/medicion/ConfiguracionesdelMedidor"
                render={() => {
                  // if (this.)
                  return (
                    <Configuraciones
                      getarrDeConfiguraciones={this.getArrDeConfiguraciones}
                      getSelectedMeter={this.state.selectedMeter}
                      setarrDeConfiguraciones={this.context.setArrDeConfiguraciones}
                      lenguaje={this.context.confPerfil.idioma}
                    />
                  );
                }}
                authenticated={this.context.isAuthenticated}
                isAdmin={this.context.isAdmin}
                exact
              />
              <PrivateRoute
                path="/medicion/MiPerfil"
                render={() => {
                  if (this.context.confPerfil.correo === null)
                    return (<IonContent><IonSpinner /></IonContent>)
                  else
                    return (
                      <Profile
                        setProfileConfiguraciones={
                          this.context.setProfileConfiguracionesHandler
                        }
                        nombreUsuario={this.context.confPerfil.usuario}
                        correoUsuario={this.context.confPerfil.correo}
                        ekmKey={this.context.confPerfil.ekmKey}
                        costoKwh={this.context.confPerfil.costoKWH}
                        lenguaje={this.context.confPerfil.idioma}
                        arrAllowedMeters={this.context.allowedMeters}
                      />
                    );
                }}
                authenticated={this.context.isAuthenticated}
                isAdmin={this.context.isAdmin}
                exact
              />
              <PrivateRoute
                path="/admin/crear"
                component={AdminProfileMaker}
                authenticated={this.context.isAuthenticated}
                isAdmin={this.context.isAdmin}
                needToBeAdmin={true}
                exact
              />
              <PrivateRoute
                path="/admin/usuarios"
                component={AdminUsersList}
                authenticated={this.context.isAuthenticated}
                isAdmin={this.context.isAdmin}
                needToBeAdmin={true}
                exact
              />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    );

  }

}

export default App;
//npx cap open android