import React from 'react'
import { IonCol, IonContent, IonCard, IonItem, IonRow, IonCardTitle } from '@ionic/react';
import GaugeItem from './gaugeItem'
import './gaugesRealTime.css'
import { isNullOrUndefined } from 'util';

type ContainerProps = {
  loadingGauge: Boolean;
  valGauge1: string;
  valGauge2: string;
  selected: string;
  realTimeData: any;
  onchangeselection: Function;

}

const Gauges = ({ loadingGauge, realTimeData }: ContainerProps) => {

  let child;
  let res;
  var resultado = -1;

  const getData = (selected: string) => {

    if (realTimeData != null) {
      res = realTimeData.readMeter.ReadSet[0].ReadData[0];

      switch (selected) {
        //totales
        case 'watts':
          resultado = res.RMS_Watts_Tot;
          break;
        case 'volts':
          resultado = Math.round((parseInt(res.RMS_Volts_Ln_1) + parseInt(res.RMS_Volts_Ln_2) + parseInt(res.RMS_Volts_Ln_3)) / 3);
          break;
        case 'amps':
          resultado = parseInt(res.Amps_Ln_1) + parseInt(res.Amps_Ln_2) + parseInt(res.Amps_Ln_3);
          break;
        case 'pf':
          resultado = Math.round((parseInt(res.Power_Factor_Ln_1) + parseInt(res.Power_Factor_Ln_2) + parseInt(res.Power_Factor_Ln_3)) / 3);
          break;
        case 'netwatts':
          resultado = parseInt(res.Net_Calc_Watts_Ln_1) + parseInt(res.Net_Calc_Watts_Ln_2) + parseInt(res.Net_Calc_Watts_Ln_3);
          break;
        case 'vars':
          resultado = parseInt(res.Reactive_Pwr_Ln_1) + parseInt(res.Reactive_Pwr_Ln_2) + parseInt(res.Reactive_Pwr_Ln_3);
          break;
        case 'frequency':
          resultado = res.Line_Freq;
          break;
        //fin totales

        //inicio linea 1
        case 'wattsL1':
          resultado = res.RMS_Watts_Ln_1;
          break;
        case 'voltsL1':
          resultado = res.RMS_Volts_Ln_1;
          break;
        case 'ampsL1':
          resultado = res.Amps_Ln_1;
          break;
        case 'pfL1':
          resultado = res.Power_Factor_Ln_1;
          break;
        case 'netwattsL1':
          resultado = res.Net_Calc_Watts_Ln_1;
          break;
        case 'varsL1':
          resultado = res.Reactive_Pwr_Ln_1;
          break;
        //fin linea 1

        //inicio linea 2
        case 'wattsL2':
          resultado = res.RMS_Watts_Ln_2;
          break;
        case 'voltsL2':
          resultado = res.RMS_Volts_Ln_2;
          break;
        case 'ampsL2':
          resultado = res.Amps_Ln_2;
          break;
        case 'pfL2':
          resultado = res.Power_Factor_Ln_2;
          break;
        case 'netwattsL2':
          resultado = res.Net_Calc_Watts_Ln_2
          break;
        case 'varsL2':
          resultado = res.Reactive_Pwr_Ln_2;
          break;
        //fin linea 2


        //inicio linea 3
        case 'wattsL3':
          resultado = res.RMS_Watts_Ln_3;
          break;
        case 'voltsL3':
          resultado = res.RMS_Volts_Ln_3;
          break;
        case 'ampsL3':
          resultado = res.Amps_Ln_3;
          break;
        case 'pfL3':
          resultado = res.Power_Factor_Ln_3;
          break;
        case 'netwattsL3':
          resultado = res.Net_Calc_Watts_Ln_3;
          break;
        case 'varsL3':
          resultado = res.Reactive_Pwr_Ln_3;
          break;
        //fin linea 3
        default:
          resultado = -99999;
          break;
      }
    }

    return isNullOrUndefined(resultado) || isNaN(resultado) ? "Nan" : resultado;
  }

  if (!loadingGauge) {

    child = (
      <IonCard className="GaugeCard" >
        <IonRow class="ion-justify-content-start"  >
          <IonCol offset=".2">
            <IonCardTitle >Tiempo Real Por Linea</IonCardTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          {/* <IonCol size="4">
            <GaugeItem colorGuage="#3366ff" gaugesOptions={{ getData, options: [{ valueLabel: "Watts", value: "wattsL1" }, { valueLabel: "Volts", value: "voltsL1" }, { valueLabel: "Amps", value: "ampsL1" }, { valueLabel: "PF", value: "pfL1" }, { valueLabel: "Net Watts", value: "netwattsL1" }, { valueLabel: "Vars", value: "varsL1" }] }} chartId="GuageL1" />
          </IonCol>
          <IonCol size="4">
            <GaugeItem colorGuage="#3366ff" gaugesOptions={{ getData, options: [{ valueLabel: "Watts", value: "wattsL2" }, { valueLabel: "Volts", value: "voltsL2" }, { valueLabel: "Amps", value: "ampsL2" }, { valueLabel: "PF", value: "pfL2" }, { valueLabel: "Net Watts", value: "netwattsL2" }, { valueLabel: "Vars", value: "varsL2" }] }} chartId="GaugeL2" />
          </IonCol>
          <IonCol size="4">
            <GaugeItem colorGuage="#3366ff" gaugesOptions={{ getData, options: [{ valueLabel: "Watts", value: "wattsL3" }, { valueLabel: "Volts", value: "voltsL3" }, { valueLabel: "Amps", value: "ampsL3" }, { valueLabel: "PF", value: "pfL3" }, { valueLabel: "Net Watts", value: "netwattsL3" }, { valueLabel: "Vars", value: "varsL3" }] }} chartId="GaugeL3" />
          </IonCol> */}
        </IonRow>
      </IonCard>
    );
  } else {
    child = <IonItem />;
  }
  return <IonContent>{child}</IonContent>;
};



export default Gauges

