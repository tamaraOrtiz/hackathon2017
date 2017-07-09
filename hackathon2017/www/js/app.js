/*
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com
*/
// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {


  /* ---------------------------------- Local Variables ---------------------------------- */
  var service        = new AvanceService();
  var pdd_service        = new PDDService();
  var initTpl        = Handlebars.compile($("#init-tpl").html());
  var homeTpl        = Handlebars.compile($("#home-tpl").html());
  var mapaTpl        = Handlebars.compile($("#pobreza-map").html());

  renderInitView();
  /* --------------------------------- Event Registration -------------------------------- */



  /* ---------------------------------- Local Functions ---------------------------------- */


  function buttonUp(){
    var inputVal = $('.searchbox-input').val();
    inputVal = $.trim(inputVal).length;
    if( inputVal !== 0){
      $('.searchbox-icon').css('display','none');
    } else {
      $('.searchbox-input').val('');
      $('.searchbox-icon').css('display','block');
    }
  };

  function renderHomeView() {
    document.body.style.background = '#fafafa';

    $('.nav-extended').show();

    //var departamentoRender = new DerpatamentoRender();
    //departamentoRender.list($('.menu_list'));
    var nivelRender = new NivelRender();
    nivelRender.initialize();

    $(".button-collapse").sideNav();
    $('.principal_content').html(homeTpl());
    $('.collapsible').collapsible();
    $(".navegacion_principal").html("");
    $(".nivel_tab").on('click', function (){

      nivelRender.list($('.principal_content'));
      $(".navegacion_principal").html("");
      $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>Niveles</a>");

      $(".button-collapse").sideNav('hide');
       });
    $(".slide-title").on('click', function (){
      renderHomeView();
      $(".button-collapse").sideNav('hide');
       });
    $(".pnd_tab").on('click', function (){
      renderHomeView();
      $(".button-collapse").sideNav('hide');
       });
    $(".icon_nav").on('click', function (){
      renderHomeView();
       });
    $(".map_tab").on('click', function (){
      $(".button-collapse").sideNav('hide');
      $('.principal_content').html(mapaTpl());
       });
    
    $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>Plan Nacional de Desarrollo 2030</a>");
    $("#facebook").on('click', function (){
      var options = {
        method: "share",
        href: $(this).data("url"),
        caption: "Hackathon 2017",
        description: "",
        picture: '',
        hashtag: '#hackathon2017'
      }
      facebookConnectPlugin.showDialog(options, function (){
        Materialize.toast('Compartiste una publicacion', 3000);
      }, function (){
        Materialize.toast('Error al actualizar estado', 3000);
      });
    });
    var submitIcon = $('.searchbox-icon');
    var inputBox = $('.searchbox-input');
    var searchBox = $('.searchbox');
    var isOpen = false;
    submitIcon.click(function(){
      if(isOpen == false){
        searchBox.addClass('searchbox-open');
        inputBox.focus();
        isOpen = true;
      } else {
        searchBox.removeClass('searchbox-open');
        inputBox.focusout();
        isOpen = false;
      }
    });
    submitIcon.mouseup(function(){
      return false;
    });
    searchBox.mouseup(function(){
      return false;
    });
    $(document).mouseup(function(){
      if(isOpen == true){
        $('.searchbox-icon').css('display','block');
        submitIcon.click();
      }
    });
    $(".searchbox-input").on('keyup', buttonUp);
  };

  function renderInitView() {
    $('.principal_content').initScrollable({y: 'auto', x: 'hidden'});
    $('.principal_content').html(initTpl());

    document.body.style.backgroundImage = 'url(img/fondo.svg)';
    window.setTimeout(function () {
      renderHomeView();
    }, 3000);
  };

  renderInitView();

}());
