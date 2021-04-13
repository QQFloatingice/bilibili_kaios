
/* 通用函数 */
//获取直播流媒体源,创建流式播放器（用的是flv.js的API）
function makeLive(room_id) {
  //获取媒体源
  $.getJSON('http://25g0cabeb.nat123.fun/services/bilibili/live/liveSource.py?cid=' + room_id + '&qn=80',function(result) {
    //错误返回
    if(result.code != 0) {
      console.log(result.code);
      return;
    };
    //设置媒体源
    var link = result.data.durl[0].url;
    //创建播放器
    player = flvjs.createPlayer({
    type: 'flv',
    url: link
    });
    player.attachMediaElement(document.getElementById('player'));
    player.load()
    player.play()
  })
}

//获取url传值
function getQueryVar(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

//获取直播间号
function getLiveRoomNumer(uid) {
  var link = 'http://25g0cabeb.nat123.fun/services/bilibili/uploader/info.py?uid=' + uid
  var id = ''
  $.ajax({
    url: link,
    success: function(result) {
      id = result.data.live_room.roomid.toString();
      console.log(id)
    },
    async:false
  })
  console.log(id)
  return id
}

/*  D-Pad  */

//设置操作函数

//全屏和一般
function fullscreen(value) {
  if(value == false) {
    document.exitFullscreen();
    $('#player').attr('class','player');
  }else if(value == true) {
    document.documentElement.requestFullscreen();
    $('#player').attr('class','player_fullscreen');
  };
}

//Enter键（中间的那个）
function enter() {
  if(document.getElementById('player').paused == true) {
    document.getElementById('player').play();
  }else{
    document.getElementById('player').pause();
  }
}

//设置按键函数
function handleKeydown(e) {
  e.preventDefault();//清除默认行为（滚动屏幕等）
  switch(e.key) {
    case 'ArrowUp':
      nav(-1);
      break;
    case 'ArrowDown':
      nav(1);
      break;
    case 'ArrowRight':
      tab(1);
      break;
    case 'ArrowLeft':
      tab(-1);
      break;
    case 'Enter':
      enter();
      break;
    case 'Backspace':
      window.history.back(1);
      break;
    case 'SoftLeft':
      //切换全屏
      if($('#player').attr('class') == 'player') {
        fullscreen(true);
      }else{
        fullscreen(false);
      }
      break;
    case 'SoftRight': //重新加载
      location.reload();
      break;
    case '2':
      navigator.volumeManager.requestShow();
      break;
  }
}

//设置触发器
document.activeElement.addEventListener('keydown', handleKeydown);

/* 启动后行为 */
;
makeLive(getLiveRoomNumer(getQueryVar('uid')));
