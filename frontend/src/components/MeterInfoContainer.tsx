import React, { Component } from 'react';
import './MeterInfoContainer.css';


import { IonContent, IonCol, IonRow, withIonLifeCycle, IonPage, IonCard, IonTitle, IonCardContent, IonCardSubtitle, IonHeader, IonToolbar, IonButtons, IonMenuButton } from '@ionic/react';

interface InfoProps {
    lenguaje: string,
    getSelectedMeter: Function,
    getarrDeConfiguraciones: Function,
    ekmKey: string,



}
class MeterInfoContainer extends Component<InfoProps> {

    state = {
        meter: "",
        group: 0,
        macAddr: "",
        firmware: "",
        model: "",
        meterName: "",
        location: "",

    }

    async ionViewWillEnter() {
        const m = this.props.getSelectedMeter();
        //console.log("Meter!", m);

        this.setState({ meter: m })
        const urlRealtime = "https://api.ekmpush.com/readMeter?key=" + this.props.ekmKey + "&meters=" + m + "&ver=v4&fmt=json&cnt=1";

        fetch(urlRealtime, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => {
                return res.json();
            }).then(dataJSON => {
                return JSON.stringify(dataJSON);
            }).then(strJSON => {
                const meterInfo = JSON.parse(strJSON).readMeter.ReadSet[0];
                this.setState({ meter: meterInfo.Meter });
                this.setState({ group: meterInfo.Group });
                this.setState({ macAddr: meterInfo.MAC_Addr });
                this.setState({ firmware: meterInfo.ReadData[0].Firmware });
                this.setState({ model: meterInfo.ReadData[0].Model });
            })


        //get arr conf
        const arreglos = this.props.getarrDeConfiguraciones();
        const existe = arreglos.some(el => el.id === m);
        if (existe) {
            //console.log("Existe");

            const index = arreglos.findIndex(x => x.id === m);
            const nom = arreglos[index].nombre;
            const ubi = arreglos[index].ubicacion;
            this.setState({
                meterName: nom,
                location: ubi,
            })
        }
        else {
            //console.log("No Existe");

            const nom = m.toString();
            const ubi = this.props.lenguaje === "English" ? "No Location" : "Sin Ubicación";

            this.setState({
                meterName: nom,
                location: ubi,

            })

        }
    }

    render() {
        const { meter, group, macAddr, firmware, model } = this.state;
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>{this.props.lenguaje === "English" ? "Meter Information" : "Información del Medidor"}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    <IonCard >
                        <br></br>
                        <IonRow class="row">
                            <IonCol>
                                <IonCardContent class="content" >
                                    <IonCardSubtitle class="subtitle">{this.props.lenguaje === "English" ? "Name" : "Nombre"} </IonCardSubtitle>
                                    {this.state.meterName}
                                </IonCardContent>
                            </IonCol>

                            <IonCol>
                                <IonCardContent class="content">
                                    <IonCardSubtitle class="subtitle">{this.props.lenguaje === "English" ? "Meter ID" : "ID de Medidor"} </IonCardSubtitle>
                                    {meter}
                                </IonCardContent>
                            </IonCol>
                        </IonRow>
                        <br></br>
                        <IonRow class="row">
                            <IonCol>
                                <IonCardContent class="content">
                                    <IonCardSubtitle class="subtitle">{this.props.lenguaje === "English" ? "MAC Address" : "Dirección MAC"} </IonCardSubtitle>
                                    {macAddr}
                                </IonCardContent>
                            </IonCol>
                            <IonCol>
                                <IonCardContent class="content">
                                    <IonCardSubtitle class="subtitle">{this.props.lenguaje === "English" ? "Meter Firmware" : "Firmware del Medidor"} </IonCardSubtitle>
                                    {firmware}
                                </IonCardContent>
                            </IonCol>

                        </IonRow>

                        <br></br>
                        <IonRow class="row">
                            <IonCol>
                                <IonCardContent class="content">
                                    <IonCardSubtitle class="subtitle">{this.props.lenguaje === "English" ? "Meter Model" : "Modelo del Medidor"} </IonCardSubtitle>
                                    {model}
                                </IonCardContent>
                            </IonCol>

                            <IonCol>
                                <IonCardContent class="content">
                                    <IonCardSubtitle class="subtitle">{this.props.lenguaje === "English" ? "Group" : "Grupo"} </IonCardSubtitle>
                                    {group}
                                </IonCardContent>
                            </IonCol>
                        </IonRow>
                        <br></br>
                        <IonRow style={{ textAlign: "center" }}>
                            <IonCol>
                                <IonCardContent class="content">
                                    <IonCardSubtitle class="subtitle">{this.props.lenguaje === "English" ? "Meter Location" : "Ubicación del Medidor"} </IonCardSubtitle>
                                    {this.state.location}
                                </IonCardContent>
                            </IonCol>
                        </IonRow>
                        <br></br>
                    </IonCard>
                </IonContent>
            </IonPage>
        );
    }
}


export default withIonLifeCycle(MeterInfoContainer);
