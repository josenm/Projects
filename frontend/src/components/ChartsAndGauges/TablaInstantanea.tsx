import React from 'react';
import { IonCard, IonGrid, IonRow, IonCol, IonCardTitle } from '@ionic/react';
import './TablaInstantanea.css'
interface ContainerProps {
    realTimeData: any;
    language: string;
}

const TablaInstantanea: React.FC<ContainerProps> = ({ realTimeData, language }) => {
    const res = realTimeData.readMeter.ReadSet[0].ReadData[0];
    //console.log("RES", res);
    const RPT = parseInt(res.Reactive_Pwr_Ln_1) + parseInt(res.Reactive_Pwr_Ln_2) + parseInt(res.Reactive_Pwr_Ln_3)
    const pta = parseInt(Math.sqrt(Math.pow(res.RMS_Watts_Tot, 2) + Math.pow(RPT, 2)).toFixed(1))

    return (
        <>
            <IonCard class="TablaInstantanea">
                <IonRow class="ion-justify-content-start"  >
                    <IonCol offset=".2">
                        <IonCardTitle >  {language === "English" ? "Instant Data" : "Datos Instantaneos"}
                        </IonCardTitle>
                    </IonCol>
                </IonRow>
                <IonGrid>
                    <IonRow class="ion-justify-content-center rowTitles">
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3"></IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3">{language === "English" ? "Power" : "Potencias"}</IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3">{language === "English" ? "Voltages" : "Voltajes"}</IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3">{language === "English" ? "Amps" : "Amperios"}</IonCol>

                    </IonRow>
                    <IonRow class="ion-justify-content-center data">
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" class="TitleFila"> {language === "English" ? "Line 1" : "Linea 1"}</IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{(res.RMS_Watts_Ln_1 / 1000).toFixed(1)}</h2><h3 >&ensp;KW</h3>  </IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{res.RMS_Volts_Ln_1}</h2> <h3 >&ensp;V</h3>  </IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3"><h2>{res.Amps_Ln_1}</h2> <h3 >&ensp;A</h3> </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center data">
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" class="TitleFila"> {language === "English" ? "Line 2" : "Linea 2"}</IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{(res.RMS_Watts_Ln_2 / 1000).toFixed(1)}</h2><h3 >&ensp;KW</h3>  </IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{res.RMS_Volts_Ln_2}</h2> <h3 >&ensp;V</h3>   </IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{res.Amps_Ln_2}</h2> <h3 >&ensp;A</h3>  </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center data">
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" class="TitleFila"> {language === "English" ? "Line 3" : "Linea 3"}</IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{(res.RMS_Watts_Ln_3 / 1000).toFixed(1)}</h2><h3 >&ensp;KW</h3>  </IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{res.RMS_Volts_Ln_3}</h2> <h3 >&ensp;V</h3>  </IonCol>
                        <IonCol sizeMd="3" sizeLg="2" sizeXs="3" ><h2>{res.Amps_Ln_3}</h2> <h3 >&ensp;A</h3>  </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center" style={{ height: "20px" }}>

                    </IonRow>
                    <IonRow class="ion-justify-content-center">
                        <IonCol sizeMd="12" sizeLg="9" sizeXs="12" class="TitleFilaTotal"> {language === "English" ? "Power" : "Potencias"}</IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center subTitleData" >
                        <IonCol sizeMd="4" sizeLg="3" sizeXs="4" >Total </IonCol>
                        <IonCol sizeMd="4" sizeLg="3" sizeXs="4" >{language === "English" ? "Reactive" : "Reactiva"}  </IonCol>
                        <IonCol sizeMd="4" sizeLg="3" sizeXs="4">{language === "English" ? "Apparent" : "Aparente"} </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center data">
                        <IonCol sizeMd="4" sizeLg="3" sizeXs="4" ><h2>{(res.RMS_Watts_Tot / 1000).toFixed(1)}</h2>  <h3 >&ensp;KW</h3></IonCol>
                        <IonCol sizeMd="4" sizeLg="3" sizeXs="4" ><h2>{(RPT / 1000).toFixed(1)}</h2> <h3 >&ensp;KVAR</h3>  </IonCol>
                        <IonCol sizeMd="4" sizeLg="3" sizeXs="4"><h2>{(pta / 1000).toFixed(1)}</h2> <h3 >&ensp;KVA</h3>  </IonCol>
                    </IonRow>

                </IonGrid>

            </IonCard>


        </>
    );
};

export default TablaInstantanea;
