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
  language: string;
  maxes: { watts, volts, amps, pf, netwatts, vars, frequency };

}

const Gauges = ({ loadingGauge, realTimeData, language, maxes }: ContainerProps) => {

  let child;
  let res;
  var resultado = -1;



  const getData = (selected: string) => {
    //console.log("Getting Data: ", maxes.watts);

    if (realTimeData != null) {
      res = realTimeData.readMeter.ReadSet[0].ReadData[0];

      switch (selected) {
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
            <IonCardTitle >{language === "English" ? "Real Time Totals" : "Tiempo Real Totales"}
            </IonCardTitle>
          </IonCol>
        </IonRow>
        <IonRow >
          <IonCol size="6">
            <GaugeItem colorGuage="#33ccff" gaugesOptions={{ getData, maxes, options: [{ valueLabel: "Watts", value: "watts" }, { valueLabel: "Volts", value: "volts" }, { valueLabel: "Amps", value: "amps" }, { valueLabel: "PF", value: "pf" }] }} chartId="Gauge2" />
          </IonCol>
          <IonCol size="6">
            <GaugeItem colorGuage="#33ccff" gaugesOptions={{ getData, maxes, options: [{ valueLabel: "Net Watts", value: "netwatts" }, { valueLabel: "Vars", value: "vars" }, { valueLabel: "Frequency", value: "frequency" }] }} chartId="Gauge1" />
          </IonCol>
        </IonRow>
      </IonCard>
    );
  } else {
    child = <IonItem />;
  }
  return <IonContent>{child}</IonContent>;
};



export default Gauges

