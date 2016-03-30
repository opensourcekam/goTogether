$('button').on('click', function(){
  var animations = 'animated pulse clicked';

  var clickedBtn = $(this).addClass(animations);

  setTimeout(function () {
    $(clickedBtn).removeClass(animations);
  }, 1000);
})
