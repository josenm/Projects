import React, { Component, } from 'react';
import { IonContent, IonCol, IonTitle, IonRow, IonPage, IonCard, IonCardContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonList, IonItemDivider, IonItem, IonInput, IonButton, IonSegment, IonSegmentButton, IonLabel, IonPopover, IonIcon, IonToast, withIonLifeCycle } from '@ionic/react';
import { getCurrentUser } from "../firebaseConfig";
import { informationOutline } from 'ionicons/icons'
import SpainFlag from '../Resources/Images/spain-flag-icon-16.png'
import USAFlag from '../Resources/Images/united-states-of-america-flag-icon-16.png'

interface ProfileProps {
    setProfileConfiguraciones: Function,
    nombreUsuario: string,
    correoUsuario: string,
    ekmKey: string,
    costoKwh: number,
    lenguaje: string,
    arrAllowedMeters: any[],


}

export default withIonLifeCycle(class Profile extends Component<ProfileProps> {


    checkAdminUser() {
        var user = getCurrentUser();
        user.then(value => {
            value?.onAuthStateChanged(user => {
                if (user?.email === "admin@admin.com") {
                }
            });
        }
        );
    }
    userName() {
        // var user = getCurrentUser();
        // //console.log("user: ", user.then(value => {
        // value?.onAuthStateChanged(user => {
        //     //console.log(user?.email);
        // });
        // }
        //     ));
    }
    state = {
        nombreUsuario: "",
        correoUsuario: "",
        costoKWHenLempiras: 1,
        showPopover: false,
        ekmKey: "",
        showToast: false,
        language: "",
        teleworksKey: false
    }

    componentDidMount = () => {

        this.setState({
            nombreUsuario: this.props.nombreUsuario,
            correoUsuario: this.props.correoUsuario,
            ekmKey: this.props.ekmKey,
            costoKWHenLempiras: this.props.costoKwh,
            language: this.props.lenguaje,
            teleworksKey: (this.props.arrAllowedMeters && this.props.arrAllowedMeters.length) ? true : false,
        })
    }

    setNombreUsuario = (x: string) => {
        this.setState(
            {
                nombreUsuario: x
            })
    }
    setLang = (x: string) => {
        this.setState(
            {
                language: x
            })
    }
    setEKMKey = (x: string) => {
        this.setState(
            {
                ekmKey: x
            })
    }
    setCorreo = (x: string) => {
        this.setState(
            {
                correoUsuario: x
            })
    }


    setKWNenLempiras = (x: number) => {
        if (this.state.costoKWHenLempiras !== x && !isNaN(x)) {

            this.setState(
                {
                    costoKWHenLempiras: x
                })
        }
    }

    setShowPopover = (x: boolean) => {
        this.setState(
            {
                showPopover: x
            })
    }

    AceptarCambiosHandler = () => {
        this.props.setProfileConfiguraciones({ usuario: this.state.nombreUsuario, correo: this.state.correoUsuario, ekmKey: this.state.ekmKey, costoKWH: this.state.costoKWHenLempiras, idioma: this.state.language });
        this.setState({
            showToast: true
        })


    }



    hideToast = () => {
        this.setState({
            showToast: false
        })
    }



    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>{this.props.lenguaje === "English" ? "My Profile" : "Mi Perfil"}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonCard class="ListaConfiguracion">
                        <IonCardContent >
                            <IonList >
                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Name of the User" : "Nombre del Usuario"}</IonItemDivider>
                                <IonItem>
                                    <IonInput value={this.state.nombreUsuario} placeholder={this.props.lenguaje === "English" ? "Enter Name of User" : "Agregar Nombre del Usuario"} onIonChange={e => this.setNombreUsuario(e.detail.value!)}></IonInput>
                                </IonItem>
                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Email of the User" : "Correo del Usuario"}</IonItemDivider>
                                <IonItem>
                                    <IonInput value={this.state.correoUsuario} placeholder={this.props.lenguaje === "English" ? "Email" : "Correo Electronico"}
                                        onIonChange={(e: any) => this.setCorreo(e.target.value)}
                                        type="email" ></IonInput>
                                    <IonPopover
                                        isOpen={this.state.showPopover}
                                        cssClass='my-custom-class'
                                        onDidDismiss={() => this.setShowPopover(false)}
                                    >{
                                            this.props.lenguaje === "English"
                                                ? <p style={{ color: "#3a3b3b", textAlign: "left", marginLeft: "8px" }}> This is the email assigned to your account. To change your sign in email, please contact a Teleworks agent at: <br /> (+504) 2501-0110 <br /> (+504) 9454-6223   </p>

                                                : <p style={{ color: "#3a3b3b", textAlign: "left", marginLeft: "8px" }}> Este es el correo asignado a su cuenta. Para cambiar su correo de ingreso, porfavor contactar a un agente de Teleworks al: <br /> (+504) 2501-0110 <br /> (+504) 9454-6223   </p>}
                                    </IonPopover>
                                    <IonButton fill="outline" onMouseOver={() => this.setShowPopover(true)}><IonIcon icon={informationOutline} /></IonButton>
                                </IonItem>
                                <IonItemDivider hidden={this.state.teleworksKey} style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "EKM Key" : "Llave EKM"}</IonItemDivider>
                                <IonItem hidden={this.state.teleworksKey}>
                                    <IonInput value={this.state.ekmKey} placeholder={this.props.lenguaje === "English" ? "Add EKM Key" : "Agregar Llave EKM"} onIonChange={e => this.setEKMKey(e.detail.value!)}></IonInput>
                                </IonItem>
                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "KWH Cost in Dollars" : "Costo por KWH en Dolares"}</IonItemDivider>
                                <IonItem>
                                    <IonInput type="tel" value={this.state.costoKWHenLempiras} placeholder={this.props.lenguaje === "English" ? "Cost in Dollars" : "Costo en Dolares"} onIonChange={e => this.setKWNenLempiras(parseFloat(e.detail.value!))} clearInput></IonInput>
                                </IonItem>

                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Language" : "Lenguaje"}</IonItemDivider>
                                <IonItem>
                                    <IonSegment value={this.state.language} onIonChange={e => { this.setLang(e.detail.value!) }}>
                                        <IonSegmentButton value="English">
                                            <IonRow >
                                                <IonLabel>EN</IonLabel>
                                                <img alt="USAFlag" id="USA" src={USAFlag} />
                                            </IonRow>

                                        </IonSegmentButton>
                                        <IonSegmentButton value="Espanol">
                                            <IonRow>
                                                <IonLabel>ES</IonLabel>
                                                <img alt="SpainFlag" id="Espana" src={SpainFlag} />
                                            </IonRow>
                                        </IonSegmentButton>
                                    </IonSegment>
                                </IonItem>
                                {/* <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>Costo por KWH en Dolares</IonItemDivider>
                                <IonItem>
                                    <IonInput type="number" value={this.state.costoKWHenDolares} placeholder="Costo en Dolares" onIonChange={e => this.setKWHenDolares(parseFloat(e.detail.value!))} clearInput></IonInput>
                                </IonItem>

                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>Moneda por defecto</IonItemDivider>
                                <IonItem>
                                    <IonSegment value={this.state.monedaPorDefecto} onIonChange={e => //console.log('Segment selected', e.detail.value)}>
                                        <IonSegmentButton value="lempiras">
                                            <IonLabel>Lempiras</IonLabel>
                                        </IonSegmentButton>
                                        <IonSegmentButton value="dolares">
                                            <IonLabel>Dolares</IonLabel>
                                        </IonSegmentButton>
                                    </IonSegment>

                                </IonItem> */}
                            </IonList>
                            <IonRow class="ion-justify-content-center">
                                <IonCol>
                                    <IonButton size="default" onClick={this.AceptarCambiosHandler} >
                                        {this.props.lenguaje === "English" ? "Accept Changes" : "Aceptar Cambios"}
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonCardContent>

                    </IonCard>
                </IonContent>
                <IonToast
                    isOpen={this.state.showToast}
                    onDidDismiss={() => this.hideToast()}
                    message={this.props.lenguaje === "English" ? "Profile saved" : "Perfil guardado"}
                    duration={4000} />
            </IonPage>
        );
    }
});