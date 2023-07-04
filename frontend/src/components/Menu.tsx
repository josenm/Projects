import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonButton, IonGrid } from '@ionic/react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { informationCircleOutline, informationCircleSharp, personOutline, personSharp, speedometerSharp, speedometerOutline, optionsOutline, optionsSharp } from 'ionicons/icons';
import './Menu.css';
import Teleworksphoto from '../Resources/Images/TeleWorksLogo.png'
import { signOut } from "../firebaseConfig";
// import SpainFlag from '../Resources/Images/spain-flag-icon-16.png'
// import USAFlag from '../Resources/Images/united-states-of-america-flag-icon-16.png'

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: [string, string];
}

const appPages: AppPage[] = [
  {
    title: ['Dashboard', 'Dashboard'],
    url: '/medicion/Dashboard',
    iosIcon: speedometerOutline,
    mdIcon: speedometerSharp
  },
  {
    title: ['Configuraciones', 'Settings'],
    url: '/medicion/ConfiguracionesdelMedidor',
    iosIcon: optionsOutline,
    mdIcon: optionsSharp
  },
  {
    title: ['Información del Medidor', 'Meter Information'],
    url: '/medicion/InformaciondelMedidor',
    iosIcon: informationCircleOutline,
    mdIcon: informationCircleSharp
  },
  {
    title: ['Mi Perfil', 'My Profile'],
    url: '/medicion/MiPerfil',
    iosIcon: personOutline,
    mdIcon: personSharp
  },

];

interface MenuProps {
  language: string,
}

const Menu: React.FC<MenuProps> = ({ language }: MenuProps) => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="side-menu">
          <IonListHeader>Menu
          </IonListHeader>
          <IonNote>{ }</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.iosIcon} />
                  {language === "English" ?
                    <IonLabel>{appPage.title[1]}</IonLabel>
                    : <IonLabel>{appPage.title[0]}</IonLabel>}

                </IonItem>
              </IonMenuToggle>
            );
          })}
          {/* <IonSegment value={Lang} onIonChange={e => { changedLanguage(e.detail.value); setLang(e.detail.value!) }}>
            <IonSegmentButton value="English">
              <IonRow >
                <IonLabel>EN</IonLabel>
                <img id="USA" src={USAFlag} />
              </IonRow>

            </IonSegmentButton>
            <IonSegmentButton value="Espanol">
              <IonRow>
                <IonLabel>ES</IonLabel>
                <img id="Espana" src={SpainFlag} />
              </IonRow>
            </IonSegmentButton>
          </IonSegment> */}
          <IonGrid id="logout">
            <IonButton color="medium" onClick={signOut}>
              Log Out
            </IonButton>
          </IonGrid>
        </IonList>


        <img alt="" id="logo" src={Teleworksphoto} />

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
