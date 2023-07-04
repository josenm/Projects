import React from 'react'
import { IonCol, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonRow, IonText, IonCardSubtitle } from '@ionic/react';
import './BillingCycle.css'
import { Doughnut } from 'react-chartjs-2'
import moment from 'moment'
import "moment/locale/es"
type ContainerProps = {
    loadingBillingCycle: Boolean;
    data: JSON;
    currentBudgetRate: number;
    budgetGoal: number;
    cycleLastDate: number;
    language: string;
}

// function getDollarRate() {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             fetch('https://free.currconv.com/api/v7/convert?q=HNL_USD&compact=ultra&apiKey=f7d753a45eb5166e4776')
//                 .then(
//                     res => {
//                         resolve(res.json());
//                     }
//                 )
//         }, 0);
//     });
// }

const BillingCycle: React.FC<ContainerProps> = ({ cycleLastDate, loadingBillingCycle, data, currentBudgetRate, budgetGoal, language }: ContainerProps) => {

    const Chartdata = {
        labels: [
            language === "English" ? "Days Passed" : 'Días Transcurridos',
            language === "English" ? "Days Left" : 'Días Faltantes',
        ],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                '#36A2EB',
                '#FF6384',
            ],
            hoverBackgroundColor: [
                '#36A2EB',
                '#FF6384',
            ]
        }]
    };




    const [currency] = React.useState("dolares")
    // const [] = React.useState(false)
    const [USDRate] = React.useState(1)

    if (!loadingBillingCycle) {
        var fecha1 = "";
        var fecha2 = "";
        //console.log(data[0].Start_Date);
        if (language === "English")
            moment.locale('en');
        else
            moment.locale('es');



        fecha1 = (moment(data[0].Start_Date).format('D MMMM YYYY'));
        if (cycleLastDate === 31) {
            fecha2 = (moment().daysInMonth() + moment().format(' [de] MMMM YYYY'));
            Chartdata.datasets[0].data = [(moment().diff(moment(data[0].Start_Date), 'days')), (moment().daysInMonth() - moment().date())]
        }
        else if (moment().date() >= cycleLastDate) {
            fecha2 = cycleLastDate + (moment().add(1, 'month').format(' [de] MMMM YYYY'));
            Chartdata.datasets[0].data = [(moment().diff(moment(data[0].Start_Date), 'days')), (moment().diff(moment().add(1, 'month').set("date", cycleLastDate), 'days'))]
        }
        else {
            fecha2 = cycleLastDate + (moment().format(' [de] MMMM YYYY'));
            // //console.log("Cant ddiasss: ", (moment(data[0].Start_Date).endOf('month')));

            Chartdata.datasets[0].data = [(moment().diff(moment(data[0].Start_Date), 'days')), (moment().diff(moment().set("date", cycleLastDate), 'days'))]
        }
        fecha2.replace('-', '');
        Chartdata.datasets[0].data = [(Math.abs(Chartdata.datasets[0].data[0])), Math.abs(Chartdata.datasets[0].data[1])];
        return (
            <IonRow class="ion-justify-content-center">
                <IonCol>
                    <IonCard class="BillingCycleCard">
                        <IonCardHeader >
                            {/* <IonRow>
                                <IonCol> */}
                            <IonCardTitle >
                                {language === "English" ? "Billing Cycle" : "Ciclo de Facturacón"}
                            </IonCardTitle>
                            {/* </IonCol> */}
                            {/* <IonCol>
                                    <IonSegment value={currency} onIonChange={e => { if (!fetchedRate) { fetchRate(setUSDRate); setFetchedRate(true); } setCurrency(e.detail.value!) }}>
                                        <IonSegmentButton value="lempiras">
                                            <IonLabel>HNL</IonLabel>
                                        </IonSegmentButton>
                                        <IonSegmentButton  value="dolares">
                                            <IonLabel>USD</IonLabel>
                                        </IonSegmentButton>
                                    </IonSegment>
                                </IonCol> */}

                            {/* </IonRow> */}

                        </IonCardHeader>

                        <IonCardContent>

                            <IonRow class="ion-align-items-center">
                                <IonCol>
                                    <IonCardSubtitle>{(data[0].kWh_Tot_Diff).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} KWH</IonCardSubtitle>
                                </IonCol>
                                <IonCol>
                                    <Doughnut data={Chartdata} options={{
                                        title: {
                                            display: true,
                                            text: language === "English" ? "Day Cycle" : "Ciclo de Días",
                                            position: 'top',
                                            padding: 1,
                                            fontStyle: 'normal'
                                        },
                                        legend: {
                                            display: false,
                                        },
                                        responsive: true,
                                    }}></Doughnut>
                                </IonCol>
                            </IonRow>
                            <IonRow class="ion-align-items-end" style={{ borderTop: "1px #ccc solid" }}>
                                <IonCol>
                                    <IonText>
                                        {language === "English" ? "Dates" : "Fechas"}: {fecha1} - {fecha2}
                                    </IonText>
                                </IonCol>
                            </IonRow>

                            <IonRow class="ion-align-items-end">
                                <IonCol>
                                    <IonText>
                                        {language === "English" ? "Current Cost" : "Costo Actual"}: {currency === "lempiras" ? ("L.") : ("$")}
                                    </IonText>
                                    <IonText>
                                        {currency === "lempiras" ? Math.round((data[0].kWh_Tot_Diff) * currentBudgetRate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : Math.round((data[0].kWh_Tot_Diff) * (currentBudgetRate * USDRate)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow class="ion-align-items-end">
                                <IonCol>
                                    <IonText>
                                        {language === "English" ? "Target Cost" : "Costo Meta"}:&nbsp;
                                    </IonText>
                                    <IonText style={{ fontWeight: "bold", color: Math.round((data[0].kWh_Tot_Diff) * currentBudgetRate) <= budgetGoal ? (budgetGoal * .10) < budgetGoal - Math.round((data[0].kWh_Tot_Diff) * currentBudgetRate) ? "green" : "#ffae00" : "red" }}  >
                                        {currency === "lempiras" ? ("L.") : ("$")}
                                    </IonText>
                                    <IonText style={{ fontWeight: "bold", textDecoration: "underline", color: Math.round((data[0].kWh_Tot_Diff) * currentBudgetRate) <= budgetGoal ? (budgetGoal * .10) < budgetGoal - Math.round((data[0].kWh_Tot_Diff) * currentBudgetRate) ? "green" : "#ffae00" : "red" }}  >
                                        {currency === "lempiras" ? budgetGoal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : (Math.round(budgetGoal * USDRate)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </IonText>

                                </IonCol>
                            </IonRow>
                            <IonRow class="ion-align-items-end">
                                <IonCol>
                                    <IonText>
                                        {language === "English" ? "Last Month Cost" : "Costo Mes Anterior"}: {currency === "lempiras" ? ("L.") : ("$")}
                                    </IonText>
                                    <IonText>
                                        {currency === "lempiras" ? Math.round((data[1].kWh_Tot_Diff) * currentBudgetRate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : Math.round((data[1].kWh_Tot_Diff) * (currentBudgetRate * USDRate)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </IonText>
                                </IonCol>
                            </IonRow>

                        </IonCardContent>
                    </IonCard>

                </IonCol>

            </IonRow >



        );
    }
    else {
        return (
            <IonRow>

            </IonRow>
        )


    }
}

export default BillingCycle;