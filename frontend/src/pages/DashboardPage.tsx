import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonSelect, IonSelectOption, IonLoading, IonCard, IonButton, IonCardContent, IonCardTitle, withIonLifeCycle } from '@ionic/react';
import React from 'react';
//import { useParams } from 'react-router';
import DashboardContainer from '../components/DashboardContainer'
import './Page.css';
import './DashboardPage.css'
function getMeters(authkey: string) {
  return new Promise(resolve => {

    fetch('https://api.ekmpush.com/meterAuth?key=' + authkey)
      .then(res => resolve(res.json()))
  });
}

interface DashboardProps {
  setMeter: Function;
  arrConfiguraciones: Function,
  arrAllowedMeters: any[]
  ekmKey: string,
  costoKwh: number,
  lenguaje: string,

}


class DashboardPage extends React.Component<DashboardProps> {

  state = {
    loading: true,
    meters: new Array(0),
    selectedMeter: "-1",
    nombreMedidor: "",
    fechaDeCorte: 31,
    costoMeta: 0,
    ekmKeyNull: false
  }


  async ionViewDidEnter() {

    if (this.props.ekmKey !== "-1" && this.props.ekmKey !== null) {
      await this.loadMeters();
      // console.log("Mount");

    }
    this.UpdateMeterInfo();


  }

  async componentDidUpdate(prevProps) {
    if ((prevProps.ekmKey !== this.props.ekmKey && this.props.ekmKey !== null)) {
      await this.loadMeters();
      this.UpdateMeterInfo();
      //console.log("Update", this.props.ekmKey);

    }

  }

  loadMeters = async () => {
    const res: any = await getMeters(this.props.ekmKey);

    if (res.status_code === "401" || res.error === "Invalid key") {
      this.setState({
        ekmKeyNull: true
      })
    }
    else {
      //console.log("ENtro al else");


      var tempMeterArray = new Array(0);
      if (this.props.arrAllowedMeters && this.props.arrAllowedMeters.length) {
        tempMeterArray = this.props.arrAllowedMeters;
      }
      else {
        //emptt
        res.forEach(element => {
          tempMeterArray.push(element.meter);
        });

      }
      let arreglos = this.props.arrConfiguraciones();
      const hayDefault = arreglos.findIndex(el => el.medidorDefecto === true);
      let meter = tempMeterArray[0];
      if (hayDefault !== -1) {
        meter = arreglos[hayDefault].id;
      }
      if (res !== null) {
        this.setState({
          ekmKey: false,
          meters: tempMeterArray,
          selectedMeter: meter,

          // loading: false,
        })
        this.props.setMeter(meter)
      }
    }
  }

  componentWillMount() {
    this.UpdateMeterInfo();
  }


  UpdateMeterInfo = () => {
    let arreglos = this.props.arrConfiguraciones();
    const existe = arreglos.some(el => el.id === this.state.selectedMeter);
    if (existe) {
      const index = arreglos.findIndex(x => x.id === this.state.selectedMeter);
      const nom = arreglos[index].nombre;
      const costometa = arreglos[index].costoMeta;
      const fechacorte = arreglos[index].fechaDeCorte;
      this.setState({
        nombreMedidor: nom,
        fechaDeCorte: fechacorte,
        costoMeta: costometa
      })

    }
    else {
      const nom = this.state.selectedMeter.toString();
      this.setState({
        nombreMedidor: nom,
        fechaDeCorte: 31,
        costoMeta: 0
      })

    }
  }

  finishedLoading = () => {
    this.setState({
      loading: false
    })
  }

  render() {

    return (




      <IonPage key={this.props.ekmKey} className="DashboardPage">
        {this.props.ekmKey === "-1" || this.state.ekmKeyNull ?

          <><IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Error</IonTitle>

            </IonToolbar>
          </IonHeader>
            <IonContent style={{}}>
              <IonCard style={{ maxWidth: "350px", margin: "auto", marginTop: "75px", padding: "25px" }}>
                <IonCardTitle style={{ borderBottom: "1px #cccc solid " }}>
                  {this.props.lenguaje === "English" ? "Error Invalid Key" : "Error Llave Invalida"}

                </IonCardTitle>
                {this.props.lenguaje === "English"
                  ? < IonCardContent >
                    It wasn't possible to extract information from the meter using the EKM key that was inserted. <br /> <br />If it's the first time
                  that you are entering the application, please go to "My Profile" and insert the EKM key registered with your account.
            </IonCardContent>

                  : <IonCardContent>
                    No se pudo extraer información del medidor usando la llave EKM que introdujo. <br /> <br />Si es la primera vez que
                ingresa a la aplicación porfavor vaya a las "Mi Perfil" e ingrese la llave de EKM asignada a su cuenta.
            </IonCardContent>
                }
                <IonButton expand="full" href="/medicion/MiPerfil" ion-button color="dark" shape="round">  {this.props.lenguaje === "English" ? "Profile Configurations" : "Configuraciones De Perfil"}</IonButton>
                <IonButton expand="full" onClick={() => window.location.reload()} ion-button color="primary" shape="round">  {this.props.lenguaje === "English" ? "Try Again" : "Probar Nuevamente"}</IonButton>

              </IonCard>

            </IonContent></>


          : <> <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonItem slot="end" lines="none">
                <IonLabel>{this.props.lenguaje === "English" ? "Meter" : "Medidor"} </IonLabel>
                <IonSelect onIonChange={(e) => { this.props.setMeter(e.detail.value); this.UpdateMeterInfo(); this.setState({ selectedMeter: e.detail.value, loading: true }) }} value={this.state.selectedMeter} placeholder={this.props.lenguaje === "English" ? "Select One" : "Seleccione Uno"} style={{ minWidth: "fit-content" }} >
                  {this.state.meters.map((meter, pos) => (
                    <IonSelectOption key={meter + pos} value={meter} >{meter}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonToolbar>
            <IonToolbar >
              <IonTitle size="large" style={{ textAlign: "center" }}>{this.state.nombreMedidor !== "-1" ? this.state.nombreMedidor : ""}</IonTitle>

            </IonToolbar>
          </IonHeader>

            <IonContent>
              <IonLoading isOpen={this.state.loading} message={this.props.lenguaje === "English" ? "Loading Meter..." : "Cargando medidor.."} />
              <DashboardContainer language={this.props.lenguaje} KwhRate={this.props.costoKwh} ekmKey={this.props.ekmKey} costoMeta={this.state.costoMeta} fechaDeCorte={this.state.fechaDeCorte} finishedLoading={this.finishedLoading} selectedMeter={this.state.selectedMeter.toString()}></DashboardContainer>
            </IonContent>
          </>}
      </IonPage>



    );
  }
};

export default withIonLifeCycle(DashboardPage);