// /*daiem add*/
function firstAccess(){
    if(location.hash.indexOf('hevb') != -1){return false;}
    var checkFirstAccess = $('#checkFirstAccess').val();
    if (checkFirstAccess > 0) {
        $.ajax({
            type: "GET",
            datatype: "json",
            url: '../../api/isFirstAccess',
            data:{id: checkFirstAccess},
            success: function (data) {
                if (data.status == 1) {
                    if (data.total > 0) {
                        $(".hevbalert .hevbcon").text(data.descrip+'+'+data.total);
                        var str = String(data.total),len = str.length,html = '';
                        for (var i = 0;i < len ;i++) {
                            html += '<img src="../../images/hevb/'+str[i]+'.png">';
                        }
                        $(".hevbalert .hevbcoin").html(html);
                        setTimeout(function(){
                            $(".hevbalert").show().animate({opacity:1},'slow').click(function(){
                                window.location.href = '../../hevbComplete/complete';
                            });
                        },1000);
                        setTimeout(function(){
                            $(".hevbalert").animate({opacity:0},'slow').hide("slow");
                        },3000);
                        location.hash = 'hevb';
                    }
                    delete data;
                }
            }
        });
    }
}/*daiem add*/

$(function(){
  //on ajax start
  $(document).on('ajaxStart', function(e,xhr, options){
      $(".header #refresh .refresh").addClass('rotation1');
    $(".load-pup").removeClass('hidden');
  });

  $(document).on('ajaxStop', function(e,xhr, options){
      setTimeout(function(){
          $(".header #refresh .refresh").removeClass('rotation1');
      },1000);
      $(".load-pup").addClass('hidden');
  });
  firstAccess();/*daiem add*/
});