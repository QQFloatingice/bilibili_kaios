//跨域设置
$.ajaxSettings.xhr = function () {
    try {
        return new XMLHttpRequest({ mozSystem: true });
    } catch (e) { }
}; 
/* 通用函数 */
//获取直播流媒体源,创建流式播放器（用的是flv.js的API）
function makeLive(room_id) {
  //获取媒体源
  $.getJSON(  'http://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id='+room_id+'&no_playurl=0&mask=0&qn=80&platform=web&protocol=0,1&format=0,2&codec=0,1',function(result) {
    //错误返回
    if(result.code != 0) {
      console.log(result.code);
      return;
    };
	if(result.data.playurl_info)
	{
		  //设置媒体源
    var data = result.data.playurl_info.playurl.stream[0].format[0].codec[0];
	var url = data.url_info[0].host + data.base_url+data.url_info[0].extra; 
	//console.log(url); 
	
    //创建播放器
    player = flvjs.createPlayer({
    type: 'flv',
    url: url
    });
    player.attachMediaElement(document.getElementById('player'));
    player.load()
    player.play()
	}
	else{
		alert("直播不在进行中！");
	} 
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
  var link = 'http://api.bilibili.com/x/space/acc/info?mid=' + uid
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
	if (e.key != "EndCall") { 
		e.preventDefault();//清除默认行为（滚动屏幕等）
	}
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
	case 'Q':
    case 'SoftLeft':
      //切换全屏
      if($('#player').attr('class') == 'player') {
        fullscreen(true);
      }else{
        fullscreen(false);
      }
      break;
	case 'E':
    case 'SoftRight': //重新加载
      location.reload();
      break;
    case '2':
      navigator.volumeManager.requestUp();
      break;
	case '8':
      navigator.volumeManager.requestDown();
      break;
  }
}

//设置触发器
document.activeElement.addEventListener('keydown', handleKeydown);

/* 启动后行为 */
;
makeLive(getLiveRoomNumer(getQueryVar('uid')));
