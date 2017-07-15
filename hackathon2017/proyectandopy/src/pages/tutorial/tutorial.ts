import { Component } from '@angular/core';


@Component({
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides = [
    {
      title: "Plan Nacional de Desarrollo 2030",
      description: "El <b>Plan Nacional de Desallo 2030 o PND</b> busca coordinar las acciones de los Poderes de Estado, niveles de gobierno, sociedad civil y sector privado a fin de mejorar la gestión de País",
      image: "assets/img/57.svg",
    },
    {
      title: "Ejes Estratégicos",
      description: "El PND se basa en una estructura de objectivos, a partir de tres <b>Ejes Estratégicos:</b></br> 1. Reducción de pobreza y desarrollo social. </br> 2. Crecimiento económico inclusivo. </br> 3. Inserción de Paraguay en el mundo en forma adecuada. ",
      image: "assets/img/ejes.jpg",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];
}
