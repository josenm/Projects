import React, { useState } from 'react'
import { IonCol, IonRow, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
// const gaugePromise = import ('framework7-react');


// const GaugeChart = React.lazy(() => gaugePromise);
import { Gauge } from "framework7-react";
interface Option {
  valueLabel: string,
  value: string,
}

interface Options {
  getData: Function;
  maxes: { watts, volts, amps, pf, netwatts, vars, frequency };
  options: Option[];

}
type ContainerProps = {
  chartId: string,
  colorGuage: string,
  gaugesOptions: Options,
}


const GaugeItem = ({ chartId, gaugesOptions, colorGuage }: ContainerProps) => {

  const [selected, setSelected] = useState(gaugesOptions.options[0].value);



  //console.log("Max!", parseInt(gaugesOptions.maxes[selected]));
  //console.log("Last Data", parseInt(gaugesOptions.getData(selected)));


  //console.log("Porcentaje", parseInt(gaugesOptions.getData(selected)) / parseInt(gaugesOptions.maxes[selected]));


  return (

    <IonCol>
      <IonRow class="ion-justify-content-center">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Gauge
            type="semicircle"
            value={gaugesOptions.getData(selected) === "Nan" ? 0 : parseInt(gaugesOptions.getData(selected)) / parseInt(gaugesOptions.maxes[selected])}
            valueText={gaugesOptions.getData(selected).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            valueTextColor={colorGuage}
            borderColor={colorGuage}
            id={chartId}
            size="180"
            labelText=""
          />
        </React.Suspense>
      </IonRow>
      <IonRow style={{ marginBottom: "10px", marginTop: "15px", maxHeight: "48px" }} >
        <IonItem>
          <IonSelect
            style={{ color: "#706e6c" }}
            interface="popover"
            value={selected}
            onIonChange={(e) => setSelected(e.detail.value)}>
            {gaugesOptions.options.map((gaugeOption) => (
              <IonSelectOption key={gaugeOption.value} value={gaugeOption.value} >{gaugeOption.valueLabel}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonRow>
    </IonCol>

  );

}

export default GaugeItem;