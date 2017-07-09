var maxHeight = $('body').prop('clientHeight') - $('.nav-extended').prop('clientHeight');
var maxWidth = $('body').prop('clientWidth');

$.fn.extend({
  initScrollable: function(options) {
    if(options !== undefined && options.y !== undefined) {
      $(this).css('overflow-y', options.y);
      if (options.y !== 'hidden'){
          $(this).css('height', maxHeight);
      }
    }else{
      $(this).css('overflow-y', 'auto');
      $(this).css('height', parseInt(maxHeight*0.95));
    }
    if(options !== undefined && options.x !== undefined) {
      $(this).css('overflow-x', options.x);
      if(options.x !== 'hidden'){
        $(this).css('width', parseInt(maxWidth)*0.95);
      }
    }
  }
});
