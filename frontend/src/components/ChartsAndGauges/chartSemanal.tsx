import React from 'react'
import { IonItem, IonCol, IonSegment, IonContent, IonSegmentButton, IonLabel, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonGrid, IonRow } from '@ionic/react';
import { HorizontalBar } from 'react-chartjs-2'
import Spinner from '../../components/Spinner/Spinner'
import './chartSemanal.css'

type ContainerProps = {
  selected: any;
  onchangeselection: Function;
  loadingchart1: Boolean;
  dias: Array<String>;
  KWHSemanalchart: Array<any>;
  ReactiveSemanalchart: Array<any>;
  language: string;

}

const ChartSemanal = ({ selected, onchangeselection, loadingchart1, dias, KWHSemanalchart, ReactiveSemanalchart, language }: ContainerProps) => {

  var chart1;

  if (!loadingchart1) {
    /* <IonListHeader color="light">Vertical Bar Chart</IonListHeader>*/
    var data = new Array(0);
    data.push({
      label: 'KWH',
      data: KWHSemanalchart,
      backgroundColor: 'rgb(98,225, 224)', // array should have same number of elements as number of dataset
      borderColor: 'rgb(13, 169, 169)',// array should have same number of elements as number of dataset
      borderWidth: 1
    })
    if (selected === 'valores reales') {
      data.push({
        label: 'KVAR',
        data: ReactiveSemanalchart,
        backgroundColor: 'rgb(187, 133, 255)', // array should have same number of elements as number of dataset
        borderColor: 'rgb(127, 81, 240)',// array should have same number of elements as number of dataset
        borderWidth: 1
      });
    }
    chart1 =
      <IonCard >
        <IonCardHeader>
          <IonGrid fixed className="chartSegments">
            <IonRow class="ion-justify-content-start">
              <IonCardTitle>{language === "English" ? "Weekly Report" : "Reporte Semanal"}</IonCardTitle>
            </IonRow>
            <IonRow class="ion-justify-content-end" >
              <IonCol sizeMd="7" sizeLg="7" sizeSm="9" sizeXs="12"  >
                <IonRow class="ion-justify-content-end" >
                  <IonSegment value={selected} class="Segment" onIonChange={(e) => onchangeselection(e.detail.value)} >
                    {/* <IonSegmentButton value="lempiras">
                      <IonLabel >Lempiras</IonLabel>
                    </IonSegmentButton> */}
                    <IonSegmentButton value="dolares">
                      <IonLabel>{language === "English" ? "Cost USD" : "Costo USD"}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="valores reales">
                      <IonLabel >{language === "English" ? "Real Data" : "Valores Reales"}</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardHeader>
        <IonCardContent className="canvas-container">
          <HorizontalBar data={{
            labels: dias,
            datasets: data
          }}
            options={{ maintainAspectRatio: false }}


          />
        </IonCardContent>
      </IonCard>


  }
  else {
    chart1 = <IonItem> <Spinner /> </IonItem>
  }


  return (
    <IonContent>
      {chart1}
    </IonContent>
  );
}


export default ChartSemanal;