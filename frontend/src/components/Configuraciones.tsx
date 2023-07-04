import React, { Component } from 'react';
import './Configuraciones.css';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonRow, IonCol, IonCardContent, IonList, IonItemDivider, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonToast } from '@ionic/react';

interface ConfiguracionesProps {
    getarrDeConfiguraciones: Function,
    setarrDeConfiguraciones: Function,
    getSelectedMeter: number
    lenguaje: string,

}
class Configuraciones extends Component<ConfiguracionesProps> {

    state = {
        meterName: "",
        costoMeta: 0,
        fechaDeCorte: -1,
        ubicacion: "",
        medidorPorDefecto: false,
        showToast: false,
        showToast2: false,

    }
    componentDidMount() {        ////console.log("lenguahe en perfill", this.props.lenguaje);

        this.UpdateMeterInfo();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.getSelectedMeter !== this.props.getSelectedMeter) {
            this.UpdateMeterInfo();

        }

    }

    UpdateMeterInfo = () => {
        const meter = this.props.getSelectedMeter;
        ////console.log("Updating Meter: ", meter);
        //console.log("Update Meter Info", this.props.getarrDeConfiguraciones, "Meter", this.props.getSelectedMeter);


        const arreglos = this.props.getarrDeConfiguraciones();
        const existe = arreglos.some(el => el.id === meter);
        const defaultMeter = arreglos.findIndex(el => el.medidorDefecto === true);
        if (existe) {
            ////console.log("Existe");

            const index = arreglos.findIndex(x => x.id === meter);
            const nom = arreglos[index].nombre;
            const costometa = arreglos[index].costoMeta;
            const fechacorte = arreglos[index].fechaDeCorte;
            const ubicacion = arreglos[index].ubicacion;
            const defecto = arreglos[index].medidorDefecto;
            this.setState({
                meterName: nom,
                costoMeta: costometa,
                fechaDeCorte: fechacorte,
                ubicacion: ubicacion,
                medidorPorDefecto: defecto,
            })

        }
        else if (defaultMeter !== -1) {
            const nom = arreglos[defaultMeter].nombre;
            const costometa = arreglos[defaultMeter].costoMeta;
            const fechacorte = arreglos[defaultMeter].fechaDeCorte;
            const ubicacion = arreglos[defaultMeter].ubicacion;
            const defecto = arreglos[defaultMeter].medidorDefecto;
            this.setState({
                meterName: nom,
                costoMeta: costometa,
                fechaDeCorte: fechacorte,
                ubicacion: ubicacion,
                medidorPorDefecto: defecto,
            })

        }
        else {
            const nom = meter.toString();
            this.setState({
                meterName: nom,
                costoMeta: 0,
                fechaDeCorte: -1,
                ubicacion: "",
                medidorPorDefecto: false,

            })

        }
    }


    hideToast = () => {
        this.setState({
            showToast: false
        })
    }
    hideToast2 = () => {
        this.setState({
            showToast2: false
        })
    }

    setMetername = (x: string) => {
        this.setState({
            meterName: x
        })
    }
    setLocation = (x: string) => {
        this.setState({
            ubicacion: x
        })
    }
    setCostoMeta = (x: number) => {
        if (this.state.costoMeta !== x && !isNaN(x)) {

            this.setState({
                costoMeta: x
            })
        }
    }
    setFechaCorte = (x: number) => {
        this.setState({
            fechaDeCorte: x
        })
    }
    setMedidorPorDefecto = (x: boolean) => {
        this.setState({
            medidorPorDefecto: x
        })
    }
    AceptarCambiosHandler = () => {
        const medidorSeleccionador = this.props.getSelectedMeter;

        const costVal = this.state.costoMeta.toString().replace(',', '');
        ////console.log("Antes", this.state.costoMeta, "despues", costVal);

        if (medidorSeleccionador === -1) {
            this.setState({
                showToast: true
            })

        }
        else {
            let arreglos = this.props.getarrDeConfiguraciones();
            const existe = arreglos.some(el => el.id === medidorSeleccionador);
            if (this.state.medidorPorDefecto) {
                ////console.log("Es defecto");

                arreglos.forEach(element => {
                    ////console.log("Looping arreglo");
                    element.medidorDefecto = false;
                });
            }
            if (existe) {
                ////console.log("Existe");

                const index = arreglos.findIndex(x => x.id === medidorSeleccionador);
                arreglos[index].nombre = this.state.meterName;
                arreglos[index].costoMeta = costVal;
                arreglos[index].fechaDeCorte = this.state.fechaDeCorte;
                arreglos[index].ubicacion = this.state.ubicacion;
                arreglos[index].medidorDefecto = this.state.medidorPorDefecto;
            }

            else {
                ////console.log("No Existe");

                arreglos.push({ id: medidorSeleccionador, nombre: this.state.meterName, costoMeta: costVal, fechaDeCorte: this.state.fechaDeCorte, ubicacion: this.state.ubicacion, medidorDefecto: this.state.medidorPorDefecto });

            }
            this.props.setarrDeConfiguraciones(arreglos);
            this.setState({
                showToast2: true
            })

        }

    }

    render() {
        console.log(this.props.getSelectedMeter);

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>{this.props.lenguaje === "English" ? "Meter Settings" : "Configuraciones del Medidor"}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonCard class="ListaConfiguracion">
                        <IonCardContent >
                            <IonList >
                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Name of Meter" : "Nombre del Medidor"}</IonItemDivider>
                                <IonItem>
                                    <IonInput maxlength={30} value={this.state.meterName} placeholder={this.props.lenguaje === "English" ? "Enter Name of Meter (30 leters maximum)" : "Ingresar Nombre del Medidor (30 letras máximo)"} onIonChange={e => this.setMetername(e.detail.value!)} clearInput></IonInput>
                                </IonItem>

                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Meter Location" : "Ubicación del medidor"}</IonItemDivider>
                                <IonItem>
                                    <IonInput value={this.state.ubicacion} placeholder={this.props.lenguaje === "English" ? "Enter the location of the meter" : "Ingrese la ubicación del medidor"} onIonChange={e => this.setLocation(e.detail.value!)} clearInput></IonInput>
                                </IonItem>

                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Default Meter" : "Medidor por defecto"}</IonItemDivider>
                                <IonItem>
                                    <IonSelect value={this.state.medidorPorDefecto} okText={this.props.lenguaje === "English" ? "Accept" : "Aceptar"} cancelText={this.props.lenguaje === "English" ? "Cancel" : "Cancelar"} placeholder={this.props.lenguaje === "English" ? "Select one" : "Seleccione Uno"} onIonChange={e => this.setMedidorPorDefecto(e.detail.value)}>
                                        <IonSelectOption value={true}>{this.props.lenguaje === "English" ? "True" : "Verdadero"}</IonSelectOption>
                                        <IonSelectOption value={false}>{this.props.lenguaje === "English" ? "False" : "Falso"}</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Target Cost of Meter" : "Costo Meta del Medidor"}</IonItemDivider>
                                <IonItem>
                                    <IonInput type="tel" value={this.state.costoMeta} placeholder={this.props.lenguaje === "English" ? "Add Target Cost" : "Agregar Costo Meta"} onIonChange={e => { this.setCostoMeta(parseInt(e.detail.value!.toString().replace(',', ''), 10)) }} clearInput></IonInput>
                                </IonItem>
                                <IonItemDivider style={{ color: "#62a9a9 ", fontSize: " 18px" }}>{this.props.lenguaje === "English" ? "Last date of meter billing cycle" : "Última fecha del ciclo de pago del medidor"}</IonItemDivider>
                                <IonItem>
                                    <IonSelect placeholder={this.props.lenguaje === "English" ? "Select a Date" : "Seleccione Una Fecha"} value={this.state.fechaDeCorte} okText={this.props.lenguaje === "English" ? "Accept" : "Aceptar"} cancelText={this.props.lenguaje === "English" ? "Cancel" : "Cancelar"} onIonChange={e => this.setFechaCorte(e.detail.value)}>
                                        <IonSelectOption value={1}>{this.props.lenguaje === "English" ? "1 of the month" : "1 del mes"}</IonSelectOption>
                                        <IonSelectOption value={2}>{this.props.lenguaje === "English" ? "2 of the month" : "2 del mes"}</IonSelectOption>
                                        <IonSelectOption value={3}>{this.props.lenguaje === "English" ? "3 of the month" : "3 del mes"}</IonSelectOption>
                                        <IonSelectOption value={4}>{this.props.lenguaje === "English" ? "4 of the month" : "4 del mes"}</IonSelectOption>
                                        <IonSelectOption value={5}>{this.props.lenguaje === "English" ? "5 of the month" : "5 del mes"}</IonSelectOption>
                                        <IonSelectOption value={6}>{this.props.lenguaje === "English" ? "6 of the month" : "6 del mes"}</IonSelectOption>
                                        <IonSelectOption value={7}>{this.props.lenguaje === "English" ? "7 of the month" : "7 del mes"}</IonSelectOption>
                                        <IonSelectOption value={8}>{this.props.lenguaje === "English" ? "8 of the month" : "8 del mes"}</IonSelectOption>
                                        <IonSelectOption value={9}>{this.props.lenguaje === "English" ? "9 of the month" : "9 del mes"}</IonSelectOption>
                                        <IonSelectOption value={10}>{this.props.lenguaje === "English" ? "10 of the month" : "10 del mes"}</IonSelectOption>
                                        <IonSelectOption value={11}>{this.props.lenguaje === "English" ? "11 of the month" : "11 del mes"}</IonSelectOption>
                                        <IonSelectOption value={12}>{this.props.lenguaje === "English" ? "12 of the month" : "12 del mes"}</IonSelectOption>
                                        <IonSelectOption value={13}>{this.props.lenguaje === "English" ? "13 of the month" : "13 del mes"}</IonSelectOption>
                                        <IonSelectOption value={14}>{this.props.lenguaje === "English" ? "14 of the month" : "14 del mes"}</IonSelectOption>
                                        <IonSelectOption value={15}>{this.props.lenguaje === "English" ? "15 of the month" : "15 del mes"}</IonSelectOption>
                                        <IonSelectOption value={16}>{this.props.lenguaje === "English" ? "16 of the month" : "16 del mes"}</IonSelectOption>
                                        <IonSelectOption value={17}>{this.props.lenguaje === "English" ? "17 of the month" : "17 del mes"}</IonSelectOption>
                                        <IonSelectOption value={18}>{this.props.lenguaje === "English" ? "18 of the month" : "18 del mes"}</IonSelectOption>
                                        <IonSelectOption value={19}>{this.props.lenguaje === "English" ? "19 of the month" : "19 del mes"}</IonSelectOption>
                                        <IonSelectOption value={20}>{this.props.lenguaje === "English" ? "20 of the month" : "20 del mes"}</IonSelectOption>
                                        <IonSelectOption value={21}>{this.props.lenguaje === "English" ? "21 of the month" : "21 del mes"}</IonSelectOption>
                                        <IonSelectOption value={22}>{this.props.lenguaje === "English" ? "22 of the month" : "22 del mes"}</IonSelectOption>
                                        <IonSelectOption value={23}>{this.props.lenguaje === "English" ? "23 of the month" : "23 del mes"}</IonSelectOption>
                                        <IonSelectOption value={24}>{this.props.lenguaje === "English" ? "24 of the month" : "24 del mes"}</IonSelectOption>
                                        <IonSelectOption value={25}>{this.props.lenguaje === "English" ? "25 of the month" : "25 del mes"}</IonSelectOption>
                                        <IonSelectOption value={26}>{this.props.lenguaje === "English" ? "26 of the month" : "26 del mes"}</IonSelectOption>
                                        <IonSelectOption value={27}>{this.props.lenguaje === "English" ? "27 of the month" : "27 del mes"}</IonSelectOption>
                                        <IonSelectOption value={28}>{this.props.lenguaje === "English" ? "28 of the month" : "28 del mes"}</IonSelectOption>
                                        <IonSelectOption value={31}>{this.props.lenguaje === "English" ? "End of each month" : "Fin de cada mes"}</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonList>
                            <IonRow class="ion-justify-content-center">
                                <IonCol>
                                    <IonButton size="default" onClick={this.AceptarCambiosHandler}>
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
                    message={this.props.lenguaje === "English"
                        ? "Please go back to the main page and select a meter..."
                        : "Por favor regrese a la pagina principal y elija un medidor..."}
                    duration={6000} />
                <IonToast
                    isOpen={this.state.showToast2}
                    onDidDismiss={() => this.hideToast2()}
                    message={this.props.lenguaje === "English" ? "Configurations saved" : "Configuraciones guardadas"}
                    duration={4000} />
            </IonPage>
        )
    };
}

export default Configuraciones;