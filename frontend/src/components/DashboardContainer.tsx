import React from 'react';
import './DashboardContainer.css';
import { IonContent, IonGrid, IonCol, IonRow, IonCard, IonSkeletonText } from '@ionic/react';
import ChartSemanal from '../components/ChartsAndGauges/chartSemanal'
import ChartComparativo from '../components/ChartsAndGauges/chartComparativo'
import GaugesTotales from '../components/ChartsAndGauges/gaugesRealTime'
import BillingCycle from './ChartsAndGauges/BillingCycle'
import TablaInstantanea from './ChartsAndGauges/TablaInstantanea'
import moment from 'moment'

//logica para restapi
let urlRealTimeChart;
let urlHistoricChart;
function getSummaryWeekly(meterID: string, key: string) {
  return new Promise(resolve => {
    setTimeout(() => {
      fetch('https://summary.ekmmetering.com/summary?key=' + key + '&meters=' + meterID + '&format=json&timezone=America~Tegucigalpa&report=dy&limit=7&offset=0&fields=Reactive_Energy_Tot_Diff,kWh_Tot_Diff')
        .then(res => resolve(res.json()))
    }, 0);
  });
}

function getRealTimeGauge(meterID: string, key: string) {
  if (meterID !== "-1") {
    return new Promise(resolve => {
      fetch('https://api.ekmpush.com/readMeter?key=' + key + '&meters=' + meterID + '&ver=v4&fmt=json&&timezone=America~Tegucigalpa&cnt=1&fields=RMS_Volts_Ln_1~RMS_Volts_Ln_2~RMS_Volts_Ln_3~Amps_Ln_1~Amps_Ln_2~Amps_Ln_3~RMS_Watts_Ln_1~RMS_Watts_Ln_2~RMS_Watts_Ln_3~Power_Factor_Ln_1~RMS_Watts_Tot~Power_Factor_Ln_2~Power_Factor_Ln_3~Reactive_Pwr_Ln_1~Reactive_Pwr_Ln_2~Reactive_Pwr_Ln_3~Line_Freq~Net_Calc_Watts_Ln_1~Net_Calc_Watts_Ln_2~Net_Calc_Watts_Ln_3')
        .then(res => resolve(res.json()))
    });
  }
  else {
    return null;
  }

}

function getChartComparativoData(meterID: string, type: string, fechaInicio: string, fechaFinal: string, key: string) {
  if (type === "dias") {
    return new Promise(resolve => {
      fetch('https://summary.ekmmetering.com/summary?key=' + key + '&meters=' + meterID + '&format=json&report=dy&limit=31&offset=0&timezone=America~Tegucigalpa&start_date=' + fechaInicio + '0000&end_date=' + fechaFinal + '2359&fields=kWh_Tot*')
        .then(res => resolve(res.json()))
    });
  }
  else if (type === "horas") {
    return new Promise(resolve => {
      fetch('https://summary.ekmmetering.com/summary?key=' + key + '&meters=' + meterID + '&format=json&report=hr&limit=31&offset=0&timezone=America~Tegucigalpa&start_date=' + fechaInicio + '0000&end_date=' + fechaFinal + '2359&fields=kWh_Tot*')
        .then(res => resolve(res.json()))
    });
  }
  else if (type === "meses") {
    return new Promise(resolve => {
      fetch('https://summary.ekmmetering.com/summary?key=' + key + '&meters=' + meterID + '&format=json&report=mo&limit=31&offset=0&timezone=America~Tegucigalpa&start_date=' + fechaInicio + '0000&end_date=' + fechaFinal + '2359&fields=kWh_Tot*')
        .then(res => resolve(res.json()))
    });
  }
}

function getBillingCycleData(meterID: string, fechaDeCorte: string, key: string) {
  if (meterID !== "-1") {
    return new Promise(resolve => {
      fetch('https://summary.ekmpush.com/summary?meters=' + meterID + '&key=' + key + '&format=json&timezone=America~Tegucigalpa&report=mo' + fechaDeCorte + '&limit=2&fields=kWh_Tot_Diff')
        .then(res => resolve(res.json()))
    });
  }
  else {
    return null;
  }
}

//fin logica para rest api


interface DashboardPageProps {
  selectedMeter: string
  finishedLoading: Function,
  costoMeta: number,
  fechaDeCorte: number,
  ekmKey: string,
  KwhRate: number,
  language: string
}

class DashboardContainer extends React.Component<DashboardPageProps> {

  state = {
    loadingApi: true,
    loadingChartComparativo: true,
    dias: new Array(7),
    KWHSemanal: new Array(7),
    selectedChartSemanal: "valores reales",
    selectedGauge: "watts",
    KWHSemanalchart: new Array(7),
    ReactiveSemanalchart: new Array(7),
    realTimeData: null,
    fecha1Data: new Array(0),
    fecha2Data: new Array(0),
    selectedChartComparativo: "dias",
    labelsChartComparativo: new Array(0),
    BillingCycleData: JSON,
    maxes: { watts: 0, volts: 0, amps: 0, pf: 0, netwatts: 0, vars: 0, frequency: 0 }


  }

  async componentDidMount() {
    this.setState({ loadingApi: true })

    this.loadGaugeData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.selectedMeter !== this.props.selectedMeter) {
      this.setState({ loadingApi: true, maxes: { watts: 0, volts: 0, amps: 0, pf: 0, netwatts: 0, vars: 0, frequency: 0 } })
      await this.initGaugeData();
      await this.initChartSemanal();
      await this.initBillingCycleData();
      await this.initChartComparativo();
      this.props.finishedLoading();

    }
    if (prevProps.fechaDeCorte !== this.props.fechaDeCorte) {
      this.initBillingCycleData();
    }
    if (prevProps.language !== this.props.language) {
      this.initChartSemanal();
      this.initChartComparativo();

    }
  }


  initGaugeData = async () => {
    ////console.log("Fetching new Gauge Data de Init");
    const res: any = await getRealTimeGauge(this.props.selectedMeter, this.props.ekmKey);
    if (res !== null) {
      this.setState({
        realTimeData: res,
      })
    }

  }
  initChartComparativo = async () => {

    const fecha1: any = await getChartComparativoData(this.props.selectedMeter, "dias", (moment().subtract(1, "month").format("YYYYMM").toString() + '01'), (moment().subtract(1, "month").format("YYYYMM").toString() + moment().subtract(1, "month").daysInMonth().toString()), this.props.ekmKey);
    const fecha2: any = await getChartComparativoData(this.props.selectedMeter, "dias", (moment().format("YYYYMM").toString() + "01"), (moment().format("YYYYMM").toString() + moment().daysInMonth().toString()), this.props.ekmKey);


    let arrFecha1Temp = new Array(0);
    let arrFecha2Temp = new Array(0);
    let dias = new Array(0);
    for (let index = 0; index < fecha1.length; index++) {
      arrFecha1Temp.push(fecha1[index].kWh_Tot_Diff);
    }
    for (let index = 0; index < fecha2.length; index++) {
      arrFecha2Temp.push(fecha2[index].kWh_Tot_Diff);
    }

    const cantDias = moment().subtract(1, "month").daysInMonth() < moment().daysInMonth() ? moment().daysInMonth() : moment().subtract(1, "month").daysInMonth();

    for (let index = 1; index <= cantDias; index++) {
      if (this.props.language === "English")
        dias.push("Day: " + index)
      else
        dias.push("Día: " + index)
    }

    this.setState({
      fecha1Data: arrFecha1Temp,
      fecha2Data: arrFecha2Temp,
      labelsChartComparativo: dias,
      loadingApi: false,
      loadingChartComparativo: false,

    })
  }

  initBillingCycleData = async () => {
    const CycleData = await getBillingCycleData(this.props.selectedMeter, this.props.fechaDeCorte.toString(), this.props.ekmKey)
    ////console.log(CycleData);

    this.setState({
      BillingCycleData: CycleData
    })

  }
  initChartSemanal = async () => {
    let dia = new Date();
    var options = { weekday: 'long', month: 'short', day: 'numeric' };
    const arrKWHSemanltemp = new Array(0);
    const arrReactiveSemanltemp = new Array(0);
    const arrDiastemp = new Array(0);
    const WeeklyReading: any = await getSummaryWeekly(this.props.selectedMeter, this.props.ekmKey);

    for (let x = 0; x < 7; x++) {

      if (WeeklyReading !== null && WeeklyReading[0] !== undefined) {
        arrKWHSemanltemp.push(WeeklyReading[x].kWh_Tot_Diff);
        arrReactiveSemanltemp.push(WeeklyReading[x].Reactive_Energy_Tot_Diff);
      }

      if (this.props.language === "English")
        arrDiastemp.push(dia.toLocaleDateString('en', options))
      else
        arrDiastemp.push(dia.toLocaleDateString('es-ES', options))

      dia.setDate(dia.getDate() - 1);
    }
    const arrKWHSemanltemp2 = arrKWHSemanltemp.slice(0);
    this.setState({
      KWHSemanalchart: arrKWHSemanltemp2,
      KWHSemanal: arrKWHSemanltemp,
      ReactiveSemanalchart: arrReactiveSemanltemp,
      dias: arrDiastemp,
    })

  }

  loadGaugeData = () => {

    setInterval(async () => {
      ////console.log("Fetching new Gauge Data");

      const resi: any = await getRealTimeGauge(this.props.selectedMeter, this.props.ekmKey);
      if (resi !== null) {

        const res = resi.readMeter.ReadSet[0].ReadData[0];
        const maxes = { ...this.state.maxes }

        if (res.RMS_Watts_Tot > this.state.maxes.watts)
          maxes.watts = res.RMS_Watts_Tot;
        if (Math.round((parseInt(res.RMS_Volts_Ln_1) + parseInt(res.RMS_Volts_Ln_2) + parseInt(res.RMS_Volts_Ln_3)) / 3) > this.state.maxes.volts)
          maxes.volts = Math.round((parseInt(res.RMS_Volts_Ln_1) + parseInt(res.RMS_Volts_Ln_2) + parseInt(res.RMS_Volts_Ln_3)) / 3)
        if (parseInt(res.Amps_Ln_1) + parseInt(res.Amps_Ln_2) + parseInt(res.Amps_Ln_3) > this.state.maxes.amps)
          maxes.amps = parseInt(res.Amps_Ln_1) + parseInt(res.Amps_Ln_2) + parseInt(res.Amps_Ln_3);
        if (Math.round((parseInt(res.Power_Factor_Ln_1) + parseInt(res.Power_Factor_Ln_2) + parseInt(res.Power_Factor_Ln_3)) / 3) > this.state.maxes.pf)
          maxes.pf = Math.round((parseInt(res.Power_Factor_Ln_1) + parseInt(res.Power_Factor_Ln_2) + parseInt(res.Power_Factor_Ln_3)) / 3);
        if (parseInt(res.Net_Calc_Watts_Ln_1) + parseInt(res.Net_Calc_Watts_Ln_2) + parseInt(res.Net_Calc_Watts_Ln_3) > this.state.maxes.netwatts)
          maxes.netwatts = parseInt(res.Net_Calc_Watts_Ln_1) + parseInt(res.Net_Calc_Watts_Ln_2) + parseInt(res.Net_Calc_Watts_Ln_3);
        if (parseInt(res.Reactive_Pwr_Ln_1) + parseInt(res.Reactive_Pwr_Ln_2) + parseInt(res.Reactive_Pwr_Ln_3) > this.state.maxes.vars)
          maxes.vars = parseInt(res.Reactive_Pwr_Ln_1) + parseInt(res.Reactive_Pwr_Ln_2) + parseInt(res.Reactive_Pwr_Ln_3);
        if (res.Line_Freq > this.state.maxes.frequency)
          maxes.frequency = res.Line_Freq;

        this.setState({
          realTimeData: resi,
          maxes: maxes,
        })
      }

    }, 60000);
  }

  chart1Handler = (e) => {

    this.setState({
      selectedChartSemanal: e,
    })

    var newdataKWH = this.state.KWHSemanal.slice(0);
    var rate = 1;
    if (e === "dolares")
      rate = this.props.KwhRate;


    for (let index = 0; index < 7; index++) {

      newdataKWH[index] = Math.round((this.state.KWHSemanal[index] * rate));

    }
    this.setState({
      KWHSemanalchart: newdataKWH,
    })

  }
  gaugesHandler = (e) => {
    this.setState({
      selectedGauge: e,
    })

  }

  chartComparativoHandler = async (selectedOption, fecha1, fecha2) => {

    console.log("Fecha1: ", fecha1.format('YYYYMMDD').toString());
    console.log("Fecha2: ", fecha2.format('YYYYMMDD').toString());
    console.log("Selected: ", selectedOption);
    this.setState({
      selectedChartComparativo: selectedOption,
      loadingChartComparativo: true,
    })
    let fecha1Fetch: any;
    let fecha2Fetch: any;
    let label = new Array(0);

    switch (selectedOption) {
      case 'horas':
        fecha1Fetch = await getChartComparativoData(this.props.selectedMeter, selectedOption, fecha1.format('YYYYMMDD').toString(), fecha1.format('YYYYMMDD').toString(), this.props.ekmKey);
        fecha2Fetch = await getChartComparativoData(this.props.selectedMeter, selectedOption, fecha2.format('YYYYMMDD').toString(), fecha2.format('YYYYMMDD').toString(), this.props.ekmKey);
        for (let index = 0; index <= 23; index++) {
          if (this.props.language === "English")
            label.push("Hour: " + index)

          else
            label.push("Hora: " + index)

        }
        break;
      case 'dias':
        fecha1Fetch = await getChartComparativoData(this.props.selectedMeter, selectedOption, (fecha1.format('YYYYMM').toString() + "01"), (fecha1.format('YYYYMM').toString() + fecha1.daysInMonth().toString()), this.props.ekmKey);
        fecha2Fetch = await getChartComparativoData(this.props.selectedMeter, selectedOption, (fecha2.format('YYYYMM').toString() + "01"), (fecha2.format('YYYYMM').toString() + fecha1.daysInMonth().toString()), this.props.ekmKey);
        const cantDias = fecha1.daysInMonth() < fecha2.daysInMonth() ? fecha2.daysInMonth() : fecha1.daysInMonth();
        for (let index = 1; index < cantDias; index++) {
          if (this.props.language === "English")
            label.push("Day: " + index)
          else
            label.push("Dia: " + index)
        }
        break;
      case 'meses':
        fecha1Fetch = await getChartComparativoData(this.props.selectedMeter, selectedOption, (fecha1.format('YYYYMM').toString() + "01"), (fecha1.format('YYYYMM').toString() + fecha1.daysInMonth().toString()), this.props.ekmKey);
        fecha2Fetch = await getChartComparativoData(this.props.selectedMeter, selectedOption, (fecha2.format('YYYYMM').toString() + "01"), (fecha2.format('YYYYMM').toString() + fecha1.daysInMonth().toString()), this.props.ekmKey);
        if (this.props.language === "English")
          label.push("Months");

        else
          label.push("Meses");
        break;
      default:
        return;

    }

    let arrFecha1Temp = new Array(0);
    let arrFecha2Temp = new Array(0);
    for (let index = 0; index < fecha1Fetch.length; index++) {
      arrFecha1Temp.push(fecha1Fetch[index].kWh_Tot_Diff);
    }
    for (let index = 0; index < fecha2Fetch.length; index++) {
      arrFecha2Temp.push(fecha2Fetch[index].kWh_Tot_Diff);
    }
    this.setState({
      fecha1Data: arrFecha1Temp,
      fecha2Data: arrFecha2Temp,
      labelsChartComparativo: label,
      loadingChartComparativo: false,
    })

  }


  render() {
    urlRealTimeChart = "https://widget.ekmmetering.com/EKM2/?reads=100&key=" + this.props.ekmKey + "&meter=" + this.props.selectedMeter + "&scale=realtime&bar_graph_field=kwh_tot&compare=0&total_field=kwh_tot&kwh_currency=USD&timezone=America~Tegucigalpa&historical=Green&layout=show_legend~show_buttons";
    urlHistoricChart = "https://widget.ekmmetering.com/EKM2/?reads=6&key=" + this.props.ekmKey + "&meter=" + this.props.selectedMeter + "&scale=mo&bar_graph_field=kwh_tot&compare=0&total_field=kwh_tot&kwh_currency=USD&timezone=America~Tegucigalpa&historical=Green&layout=show_legend~show_buttons&prev_scale=mo&prev_reads=6";

    return (


      < IonContent >
        <IonGrid>
          <IonRow className="GaugeComponent"  >
            <IonCol  >
              <IonContent >
                {this.state.loadingApi || this.props.selectedMeter === "-1" ? (<IonSkeletonText animated style={{ width: "100%", height: "100%" }} />) : (<GaugesTotales maxes={this.state.maxes} language={this.props.language} onchangeselection={this.gaugesHandler} realTimeData={this.state.realTimeData} selected={this.state.selectedGauge} loadingGauge={this.state.loadingApi} valGauge1="gauge1" valGauge2="gauge2" />)}
              </IonContent>
            </IonCol >
          </IonRow>
          {/* <IonRow className="GaugeComponent"  >
            <IonCol  >
              <IonContent >
                {this.state.loadingApi || this.props.selectedMeter === "-1" ? (<IonSkeletonText animated style={{ width: "100%", height: "100%" }} />) : (<GuagesPorLinea onchangeselection={this.gaugesHandler} realTimeData={this.state.realTimeData} selected={this.state.selectedGauge} loadingGauge={this.state.loadingApi} valGauge1="hola" valGauge2="hola2" />)}
              </IonContent>
            </IonCol >
          </IonRow> */}
          <IonRow className="InstantTable ion-justify-content-center">


            {this.state.loadingApi || this.props.selectedMeter === "-1" ? (<IonSkeletonText animated style={{ width: "500px", height: "200px", margin: "auto" }} />) : (<TablaInstantanea language={this.props.language} realTimeData={this.state.realTimeData} />)}


          </IonRow>
          <IonRow className="BillingCycle ion-justify-content-center">
            {this.state.loadingApi || this.props.selectedMeter === "-1"
              ? (<IonSkeletonText animated style={{ width: "0%", height: "70vh", margin: "auto" }} />)
              : (<BillingCycle language={this.props.language} cycleLastDate={this.props.fechaDeCorte} budgetGoal={this.props.costoMeta} currentBudgetRate={this.props.KwhRate} data={this.state.BillingCycleData} loadingBillingCycle={this.state.loadingApi} ></BillingCycle>)}
          </IonRow>
          <IonRow className="MultiChart  ion-justify-content-center"  >
            <IonCol style={{ minHeight: "550px", maxWidth: "1000px" }} >
              {this.state.loadingApi || this.props.selectedMeter === "-1" ? (<IonSkeletonText animated style={{ width: "100%", height: "100%" }} />)
                : (<IonCard >
                  <iframe height="590px" title="MultiChartRealTime" frameBorder="0" width="100%" src={urlRealTimeChart}></iframe>
                </IonCard>)}
            </IonCol>
          </IonRow>
          <IonRow className="ChartSemanal  ion-justify-content-center" >
            <IonCol style={{ minHeight: "550px", maxWidth: "1000px" }} >
              {this.state.loadingApi || this.props.selectedMeter === "-1"
                ? (<IonSkeletonText animated style={{ width: "100%", height: "100%" }} />)
                : (<ChartSemanal selected={this.state.selectedChartSemanal} onchangeselection={this.chart1Handler} loadingchart1={this.state.loadingApi}
                  language={this.props.language} dias={this.state.dias} KWHSemanalchart={this.state.KWHSemanalchart} ReactiveSemanalchart={this.state.ReactiveSemanalchart} />)}
            </IonCol>
          </IonRow>
          <IonRow className="MultiChart  ion-justify-content-center"  >
            <IonCol style={{ minHeight: "550px", maxWidth: "1000px" }} >
              {this.state.loadingApi || this.props.selectedMeter === "-1" ? (<IonSkeletonText animated style={{ width: "100%", height: "100%" }} />) :
                (<IonCard >
                  <iframe height="590px" title="MultiChartHistorical" frameBorder="0" width="100%" src={urlHistoricChart}></iframe>
                </IonCard>)}
            </IonCol>
          </IonRow>
          <IonRow className="ChartComparativo" >
            <IonCol style={{ minHeight: "550px" }} >
              <IonContent>

                {this.state.loadingApi || this.props.selectedMeter === "-1"
                  ? (<IonSkeletonText animated style={{ width: "100%", height: "100%" }} />)
                  : (<ChartComparativo language={this.props.language} selected={this.state.selectedChartComparativo} onchangeselection={this.chartComparativoHandler} loadingChartComparativo={this.state.loadingChartComparativo}
                    Rate={this.props.KwhRate} chartLabels={this.state.labelsChartComparativo} fecha1Data={this.state.fecha1Data} fecha2Data={this.state.fecha2Data} />)}
              </IonContent>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent >)


  }
};

export default DashboardContainer;
