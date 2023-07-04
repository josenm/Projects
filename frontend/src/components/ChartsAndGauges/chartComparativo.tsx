import React, { useState } from 'react'
import { IonCol, IonSegment, IonContent, IonSegmentButton, IonLabel, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonDatetime, IonSpinner } from '@ionic/react';
import { Bar } from 'react-chartjs-2'
import './chartSemanal.css'
import moment from 'moment'
import "moment/locale/es"
type ContainerProps = {
  selected: any;
  onchangeselection: Function;
  loadingChartComparativo: Boolean;
  chartLabels: Array<String>;
  fecha1Data: Array<any>;
  fecha2Data: Array<any>;
  language: string;
  Rate: number;
}

const ChartSemanal: React.FC<ContainerProps> = ({ Rate, selected, onchangeselection, loadingChartComparativo, chartLabels, fecha1Data, fecha2Data, language }: ContainerProps) => {


  var [fecha1, setFecha1] = useState(moment().subtract(1, "month"));
  var [fecha2, setFecha2] = useState(moment());
  var labelFecha1;
  var labelFecha2;
  var data = new Array(0);


  if (selected === "dias" || selected === "meses") {
    if (language === "English") {
      labelFecha1 = fecha1.locale('en').format('MMMM, YYYY') + "  Total: " + (Math.round((fecha1Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Cost: $" + (Math.round(((fecha1Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      labelFecha2 = fecha2.locale('en').format('MMMM, YYYY') + "  Total: " + (Math.round((fecha2Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Cost: $" + (Math.round(((fecha2Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    }
    else {
      labelFecha1 = fecha1.locale('es').format('MMMM, YYYY') + "  Total: " + (Math.round((fecha1Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Costo: $" + (Math.round(((fecha1Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      labelFecha2 = fecha2.locale('es').format('MMMM, YYYY') + "  Total: " + (Math.round((fecha2Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Costo: $" + (Math.round(((fecha2Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

  }
  else {
    if (language === "English") {
      labelFecha1 = fecha1.locale('en').format('dddd DD MMMM YYYY') + "  Total: " + (Math.round((fecha1Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Cost: $" + (Math.round(((fecha1Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      labelFecha2 = fecha2.locale('en').format('dddd DD MMMM YYYY') + "  Total: " + (Math.round((fecha2Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Cost: $" + (Math.round(((fecha2Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
      labelFecha1 = fecha1.locale('es').format('dddd DD MMMM YYYY') + "  Total: " + (Math.round((fecha1Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Costo: $" + (Math.round(((fecha1Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      labelFecha2 = fecha2.locale('es').format('dddd DD MMMM YYYY') + "  Total: " + (Math.round((fecha2Data.reduce(function (a, b) { return a + b; }, 0) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Costo: $" + (Math.round(((fecha2Data.reduce(function (a, b) { return a + b; }, 0) * Rate) + Number.EPSILON) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


    }

  }


  if (!loadingChartComparativo) {
    data.push({
      label: labelFecha1,
      data: fecha1Data,
      backgroundColor: 'rgb(242,195,61)',
      borderColor: 'rgb(240,188,37)',
      borderWidth: 1
    })
    data.push({
      label: labelFecha2,
      data: fecha2Data,
      backgroundColor: 'rgb(61,108,242)',
      borderColor: 'rgb(37,90,240)',
      borderWidth: 1
    });
  }



  return (

    <IonContent>
      <IonCard >
        <IonCardHeader>
          <IonGrid fixed className="chartSegments">
            <IonRow class="ion-justify-content-start">
              <IonCol >
                <IonCardTitle style={{ textAlign: "left" }}>{language === "English" ? "Comparative Report" : "Reporte Comparativo"}</IonCardTitle>
              </IonCol>

            </IonRow>
            <IonRow class="ion-justify-content-end">

              <IonCol size="auto">
                {language === "English"
                  ? <IonDatetime id="1" doneText={language === "English" ? "Accept" : "Aceptar"} cancelText={language === "English" ? "Cancel" : "Cancelar"} style={{ minWidth: "min-content" }} displayFormat="DDDD DD MMMM YYYY" value={fecha1.toISOString()} onIonChange={(e) => { setFecha1(moment(e.detail.value!).locale('en')); onchangeselection(selected, moment(e.detail.value), fecha2) }} placeholder="Fecha1" ></IonDatetime>
                  : <IonDatetime id="2" doneText={language === "English" ? "Accept" : "Aceptar"} cancelText={language === "English" ? "Cancel" : "Cancelar"} style={{ minWidth: "min-content" }} dayNames={"Lunes, Martes, Miércoles, Jueves, Viernes, Sabado, Domingo"} monthNames={"enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre"} displayFormat="DDDD DD MMMM YYYY" value={fecha1.toISOString()} onIonChange={(e) => { setFecha1(moment(e.detail.value!).locale('es')); onchangeselection(selected, moment(e.detail.value), fecha2) }} placeholder="Fecha1" ></IonDatetime>

                }
              </IonCol>
              <IonCol size="sizeXs" />
              <IonCol size="auto">
                {language === "English"
                  ? <IonDatetime id="3" doneText={language === "English" ? "Accept" : "Aceptar"} cancelText={language === "English" ? "Cancel" : "Cancelar"} style={{ minWidth: "min-content" }} displayFormat="DDDD DD MMMM YYYY" value={fecha2.toISOString()} onIonChange={(e) => { setFecha2(moment(e.detail.value!).locale('en')); onchangeselection(selected, fecha1, moment(e.detail.value)) }} placeholder="Fecha2" ></IonDatetime>
                  : <IonDatetime id="4" doneText={language === "English" ? "Accept" : "Aceptar"} cancelText={language === "English" ? "Cancel" : "Cancelar"} style={{ minWidth: "min-content" }} dayNames={"Lunes, Martes, Miércoles, Jueves, Viernes, Sabado, Domingo"} monthNames={"enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre"} displayFormat="DDDD DD MMMM YYYY" value={fecha2.toISOString()} onIonChange={(e) => { setFecha2(moment(e.detail.value!).locale('es')); onchangeselection(selected, fecha1, moment(e.detail.value)) }} placeholder="Fecha2" ></IonDatetime>

                }              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-end" >

              <IonCol sizeMd="7" sizeLg="7" sizeSm="9" sizeXs="12"  >

                <IonRow class="ion-justify-content-end" >
                  <IonCol size="auto" >
                    {loadingChartComparativo && <IonSpinner name="crescent" color="success" />}
                  </IonCol>
                  <IonSegment value={selected} class="Segment" onIonChange={(e) => onchangeselection(e.detail.value, fecha1, fecha2)} >
                    <IonSegmentButton value="horas">
                      <IonLabel >{language === "English" ? "Hours" : "Horas"}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="dias">
                      <IonLabel>{language === "English" ? "Days" : "Días"}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="meses">
                      <IonLabel >{language === "English" ? "Months" : "Meses"}</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardHeader>
        <IonCardContent className="canvas-container">
          <Bar data={{
            labels: chartLabels,
            datasets: data
          }}
            options={{ maintainAspectRatio: false }}
          />
        </IonCardContent>
      </IonCard>    </IonContent >
  );
}


export default ChartSemanal;