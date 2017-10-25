$(function (){
  var songs=
  
[
							
								{src:"./logo.png",title:"相思赋予谁",author:"翻唱",song:"http://mp3file.mafengwo.net/201611282351/1b5ca546b3d00f8d4632abe9d900724b/s9/M00/E8/BD/wKgBs1grIzmAAlEkAB6ZIzExd_Y211.mp3"},
								{src:"./logo.png",title:"相思赋予谁",author:"翻唱",song:"http://mp3file.mafengwo.net/201611282351/1b5ca546b3d00f8d4632abe9d900724b/s9/M00/E8/BD/wKgBs1grIzmAAlEkAB6ZIzExd_Y211.mp3"},
								{src:"./logo.png",title:"断桥残雪",author:"翻唱",song:"http://mp3file.mafengwo.net/201611282351/1b5ca546b3d00f8d4632abe9d900724b/s9/M00/E8/BD/wKgBs1grIzmAAlEkAB6ZIzExd_Y211.mp3"},
								{src:"./logo.png",title:"相思赋予谁",author:"翻唱",song:"http://mp3file.mafengwo.net/201611282351/1b5ca546b3d00f8d4632abe9d900724b/s9/M00/E8/BD/wKgBs1grIzmAAlEkAB6ZIzExd_Y211.mp3"},
								{src:"./logo.png",title:"东风破",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_cfca09a2bbf64d1bbd698455786bf03f.f1110.m4a?vkey=B45289CF0CD7DE916DA586A93DF9F22A64AD0296DC8FB7AD8939E94ACBD6E509182F4EC1DA7C2603DFA800E84C0F01E9821E523CABD99FC44B99575B0F1D7C9F9DA5DFBD785A42A4B1D1EE70D507ABEB0641363B5144C62E&amp;sha=7e9ca745156d1d74570c0cef7a7648fd972c444c&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"昆明湖",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_b0171cfe1f2b465f891e8f7e22ad0009.f1110.m4a?vkey=BE8B8921F972FF7D24F809D27C796F218DE3E72F7D89992536D557F434D1AFF44E39C4510B28891BFC0373798905A262D712796C198B7A4B3EE2789A5E3CDA719503E44D1143A95406498B7F91D90B596C6734C0BC930D9F&amp;sha=386df2906eff482db54eb6c5a20a5cf0730d6cf1&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"包容",author:"合唱",song:"http://mp3file.mafengwo.net/201611282351/1b5ca546b3d00f8d4632abe9d900724b/s9/M00/E8/BD/wKgBs1grIzmAAlEkAB6ZIzExd_Y211.mp3"},
								{src:"./logo.png",title:"本草纲目",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_8287dfeda1fd48398b188efa1cfbfaa3.f1110.m4a?vkey=548CE32979AE2EBDAA39C1BDC0ADB4F90D9542BFC744F375F42EB8FBA2CF9DCD69467C3C9523B1A9CA7B3B3A4FDB4C12EBFE1B6FF39C8DE5CB13BF556A3517E42BFA7592D0BF30F398F90BB04CFA77405434E313EFA8FDF3&amp;sha=5ddba7051ef4e1341c0a861b97a78e50a4437c84&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"得到你的人却得不到你的心",author:"合唱",song:"http://mp3file.mafengwo.net/201611282351/1b5ca546b3d00f8d4632abe9d900724b/s9/M00/E8/BD/wKgBs1grIzmAAlEkAB6ZIzExd_Y211.mp3"},
								{src:"./logo.png",title:"缘分",author:"翻唱",song:"http://mp3file.mafengwo.net/201611282351/1b5ca546b3d00f8d4632abe9d900724b/s9/M00/E8/BD/wKgBs1grIzmAAlEkAB6ZIzExd_Y211.mp3"}
							]
  ;

  var audio=$('audio').get(0),
  index=-1,
  volume;

  var songsUi=function () {
    //播放列表
   // $.each(songs,function(i,v){
  //    $('<li class="li"><strong class="music_name">'+v.title+'</strong><strong class="singer_name">'+v.author+'</strong><strong class="play_time">'+v.time+'</strong><div //class="list_cp"><strong class="btn_like" title="喜欢"></strong><strong class="btn_share" title="分享"></strong><strong class="btn_fav" title="收藏到歌单"></strong><strong //class="btn_del" title="从列表中删除"></strong></div></li>')
  //    .appendTo($('.single_list ul'));
 //   })
    //统计歌曲数
    $('.open_list span').text(songs.length);
  }
      songsUi();
  //点击播放
  var changMusic=function () {
    audio.src=songs[index].song;
    audio.play();
    $('.single_list li').removeClass('play_current');
    $('.single_list li').eq(index).addClass('play_current');
    $('.music_info_main .music_name span').text(songs[index].title);
    $('.music_info_main .singer_name').text(songs[index].author);
    //$('.music_info_main .play_date').text(songs[index].time);
  }

  $('.single_list ul').on('click','li',function () {
    index=$(this).index();
    changMusic();
  })
  //删除歌曲
  $('.single_list ul').on('click','.btn_del',function () {
    var _i=$('.single_list .btn_del').index(this);
    //正在播放切到下一首
    if($(this).closest('li').hasClass('play_current')){
      index=_i+1;
      changMusic();
    }
    songs=$.grep(songs,function (v,i) {
      return _i!==i;
    })
    $(this).closest('li').remove();
    return false;
  })
  //下一首
  $('.next_bt').on('click',function () {
    //随机播放
    if($('#btnplayway').hasClass('unordered_bt')){
      do{_i=Math.floor(Math.random()*songs.length)}
      while(index===_i)
      index=_i;
      //其他
    }else{
      index=index+1;
      if(index>=songs.length){
        index=0;
      }
    }
    changMusic();
  })
  //上一首
  $('.prev_bt').on('click',function () {
    //随机播放
    if($('#btnplayway').hasClass('unordered_bt')){
      do{_i=Math.floor(Math.random()*songs.length)}
      while(index===_i)
      index=_i;
      //其他
    }else{
      index=index-1;
      if(index<=-1){
        index=songs.length-1;
      }
    }
    changMusic();
  })
  //播放模式
  $('#btnplayway').on('click',function () {
    $('.playbar_cp_select').show();
  })

  $('.playbar_cp_select strong').on('click',function () {
    $('#btnplayway')
    .removeClass()
    .addClass($(this).attr('class'))
    .attr('title',$(this).attr('title'));
    $('.playbar_cp_select').hide();
  })

  //播放暂停
  $('.play_bt').on('click',function(){
    if(audio.paused){
      audio.play();
      //默认播放第一首
      if(audio.src===''){
        index=0;
        changMusic();
      }
    }else{
      audio.pause();
    }
  })
  $(audio).on('play',function () {
    $('.play_bt').addClass('pause_bt');
  })
  $(audio).on('pause',function () {
    $('.play_bt').removeClass('pause_bt');
  })
  //静音
  $('.volume_icon').on('click',function(e){
    if(audio.volume===0){
      audio.volume=volume;
    }else{
      volume=audio.volume;
      audio.volume=0;
    }
  })
  $('.volume_regulate').on('click',function (e) {
    audio.volume=e.offsetX/$(this).width();
  })
  $('.volume_op').on('click',function (e) {
    e.stopPropagation();
  })

  //拖动改变音量
  $('.volume_op').on('mousedown',function () {
    $(document).on('mousemove',function (e) {
      var regulate=$('.volume_regulate');
      e.preventDefault();
      var left=(e.clientX-regulate.offset().left-$('.volume_op').width()/2).toFixed(0);
      if(left<0||left>regulate.width()){
        return;
      }
      audio.volume=left/regulate.width();
    })
    $(document).on('mouseup',function () {
      $(this).off('mousemove');
    })
  })
  //音量界面操作
  $(audio).on('volumechange',function () {
    var percent=(this.volume/1.*100).toFixed(2)+'%';
    $('.volume_op').css('left',percent);
    $('.volume_bar').css('width',percent);
    if(this.volume===0){
      $('.volume_icon').addClass('volume_mute');
    }else{
      $('.volume_icon').removeClass('volume_mute');
    }
  })
  //播放条
  $('.play_bar').on('click',function (e) {
    if(audio.src===''){
      return;
    }
    var time=e.offsetX/$(this).width()*audio.duration;
    audio.currentTime=time;
  })
  //拖动播放条
   $('.progress_op').on('mousedown',function () {
     $(document).on('mousemove',function (e) {
       var regulate=$('.play_bar');
       e.preventDefault();
       var left=(e.clientX-$('.progress_op').width()/2).toFixed(0);

       if(left<0||left>regulate.width()){
         return;
       }
       audio.currentTime=left/regulate.width()*audio.duration;
     })
     $(document).on('mouseup',function () {
       $(this).off('mousemove');
     })
   })

  $(audio).on('timeupdate',function () {
    var percent=(audio.currentTime/audio.duration*100).toFixed(2)+'%';
    $('.play_current_bar').css('width',percent);
    $('.progress_op').css('left',percent);
  })
  //歌曲播放完之后播放下一首
  var nextsong=function () {
    //随机播放
    if($('#btnplayway').hasClass('unordered_bt')){
      do{_i=Math.floor(Math.random()*songs.length)}
      while(index===_i)
      index=_i;
      //单曲循环
    }else if($('#btnplayway').hasClass('cycle_single_bt')){
      index=index;
      //顺序播放
    }else if($('#btnplayway').hasClass('ordered_bt')){
      index=index+1;
      if(index===songs.length){
        audio.pause();
        return;
      }
      //列表循环
    }else{
      index=index+1;
      if(index===songs.length){
        index=0;
      }
    }
    changMusic();
  }
  $(audio).on('ended',nextsong)
  //打开隐藏歌曲列表
  $('.open_list').on('click',function () {
    $('.play_list_frame').toggle();
  })
  //鼠标hover显示当前位置时长
  var duration=function (time) {
    var fen=parseInt(time/60);
    var miao=time%60;
    return fen+':'+miao;
  }
  $('.play_bar').on('mouseenter mousemove',function (e) {
    var left=$(this).width()*(e.offsetX/$(this).width())-$('.time_show').width()/2;
    $('.time_show').css({'left':left,'display':'block'})
    if(audio.src===''){
      $('#time_show').text('--:--');
    }else{
      var time=parseInt(e.offsetX/$(this).width()*audio.duration);
      $('#time_show').text(duration(time))
    }
  })
  $('.play_bar').on('mouseleave',function () {
    $('.time_show').css('display','none');
  })
  //其它点击打开关闭
  $('.close_list').on('click',function () {
    $('.play_list_frame').toggle();
  })
  $('.btn_lyrics_disabled').on('click',function () {
    $('.y_player_lyrics').toggle();
  })
  $('.close_lyrics').on('click',function () {
    $('.y_player_lyrics').toggle();
  })
  $('.folded_bt').on('click',function () {
    $('.play_list_frame').hide();
    $('.y_player_lyrics').hide();
    if(!$('.m_player').hasClass('m_player_folded')){
      $('.m_player').css('left',-540)
    }else{
      $('.m_player').css('left',0)
    }
    $('.m_player')
    .delay(400)
    .queue(function () {
      $(this).toggleClass('m_player_folded').dequeue();
    })
  })
})
