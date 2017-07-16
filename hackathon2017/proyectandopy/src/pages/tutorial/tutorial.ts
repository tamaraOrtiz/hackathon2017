import { Component } from '@angular/core';


@Component({
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides = [
    {
      title: "Plan Nacional de Desarrollo 2030",
      description: "El <b>Plan Nacional de Desallo 2030 o PND</b> busca coordinar las acciones de los Poderes de Estado, niveles de gobierno, sociedad civil y sector privado a fin de mejorar la gestión del País",
      image: "assets/img/57.svg",
    },
    {
      title: "Ejes Estratégicos",
      description: "El PND se basa en una estructura de objectivos, a partir de tres <b>Ejes Estratégicos:</b></br> 1. Reducción de pobreza y desarrollo social. </br> 2. Crecimiento económico inclusivo. </br> 3. Inserción de Paraguay en el mundo en forma adecuada. ",
      image: "assets/img/ejes.jpg",
    },
    {
      title: "Niveles",
      description: "Actualmente existen 11 <b>Niveles</b> que agrupan las distinatas entidades del Gobiendo, entre ellas estan los tres poderes del Estado, entidades y empresas publicas, universidades, entre otros.",
      image: "assets/img/24.svg",
    },
    {
      title: "Entidades",
      description: "Las distintas <b>Entidade</b> del Gobiernos planean y ejecutan programas vinculados a los ejes estratégicos, con el fin de alcanzar la meta fijada en el Plan de Desarrollo 2030.",
      image: "assets/img/08.svg",
    },
    {
      title: "Programas",
      description: "Los <b>Programas</b> son un conjunto de acciones planeadas por cada entidad, que trabajan sobre un eje estratégico especifico y que cuenta con un presupuesto determinado",
      image: "assets/img/36.svg",
    },
    {
      title: "ProyectandoPy",
      description: "<b>ProyectandoPy</b> tomá los datos de los distintos programas, como número de beneficiarios y costos, y genera reportes y estadisticas útiles para ponerlos a disposición de los ciudadanos",
      image: "assets/img/44.svg",
    }
  ];
}
