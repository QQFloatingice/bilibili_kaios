
/*  通用函数  */

//打开视频
function openV() {
  const currentIndex = document.activeElement.tabIndex;
  window.location.href = './player/index.html?aid=' + aid[currentIndex] + '&bvid=' + bvid[currentIndex]
}
function playV(aid,bvid,page) {
  $('.video_normal').attr('src','https://player.bilibili.com/player.html?t=0.05&aid=' + aid + '&bvid=' + bvid + '&page=' + page + '&danmaku=0')
}

/*  获取信息  */
//设置方法
typeComments = ['item.title','item.author','item.pic','item.aid','item.bvid'];

//dict：方法（遍历时用于解析的列表：【标题，作者，配图，视频AV号，视频BV号】）（以item开头）
//each：遍历的位置（以result开头）
function getComments(dict,each,url) {
  $('.items').empty() //清空列已有的列表
  $('.items').append('正在加载…') //展示加载信息
  
  //创建用于存储信息的函数
  title = [];
  author = [];
  image = [];
  aid = [];
  bvid = [];
  //从网络获取信息
  $.getJSON(url,function(result) {
    $('.items').empty() //清空列已有的列表
    // dictTitle = eval(dict[0]);
    // dictAuthor = eval(dict[1]);
    // dictImage = eval(dict[2]);
    // dictAID = eval(dict[3]);
    // dictBVID = eval(dict[4]);
    $.each(eval(each),function(r,item) {
      title.push(eval(dict[0]));
      author.push(eval(dict[1]));
      image.push(eval(dict[2]));
      aid.push(eval(dict[3]));
      bvid.push(eval(dict[4]));
    })
    //建立列表
    $.each(title,function(r,i) {
      appendV(i,author[r],image[r],r + '');
    })
    //对焦
    document.querySelectorAll('.item')[0].focus()
  })
};

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

//加载视频信息
function getInfo() {
  var aid = getQueryVar('aid');
  $.getJSON('http://25g0cabeb.nat123.fun/services/bilibili/video/info.py?aid=' + aid, function(result) {
    var title = decodeURI(getQueryVar('title'))
    var view = result.data.view
    var danmaku = result.data.danmaku
    var like = result.data.like
    var coin = result.data.coin
    var favorite = result.data.favorite
    
    $('.items').empty();
    //标题、播放量、弹幕量
    $('.items').append("<div class='item' id='title' tabIndex='0'><a id='title'>" + title + "</a><div id='info'><div id='view'><img src='../img/inside_icon/play/view.svg'><a id='view'>" + view + "</a></div><div id='danmaku'><img src='../img/inside_icon/play/danmaku.svg'><a id='danmaku'>" + danmaku + "</a></div></div></div>")
    //点赞、投币、收藏
    $('.items').append("<div class='item' id='sanlian' tabIndex='1'><div id='like'><img src='../img/inside_icon/play/like.svg'><a id='like'>" + like + "</a></div><div id='coin'><img src='../img/inside_icon/play/coin.svg'><a id='coin'>" + coin + "</a></div><div id='favorite'><img src='../img/inside_icon/play/favorite.svg'><a id='favorite'>" + favorite + "</a></div></div>")
    //空项
    $('.items').append("<div class='item' tabIndex='2'></div><div class='item' tabIndex='3'></div><div class='item' tabIndex='4'></div>")
  });
  document.querySelectorAll('.item')[0].focus();
}

//切换全屏（指通知栏是否显示）
function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

/*  D-Pad  */
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
      if($('#player').attr('class') == 'video_normal') {
        document.documentElement.requestFullscreen();
        $('#player').attr('class','video_fullscreen');
      }else{
        document.exitFullscreen();
        $('#player').attr('class','video_normal');
      }
      break;
    case 'SoftRight':
      navigator.volumeManager.requestShow();
      break;
    case '2':
      navigator.volumeManager.requestShow();
      break;
  }
}
//设置导航键函数
var tab_location = 0;//设置header位置
function nav(move) {
  const currentIndex = document.activeElement.tabIndex;
  const next = currentIndex + move;
  const items = document.querySelectorAll('.item');
  const targetElement = items[next];
  targetElement.focus();
  if(next == 0) {
    $('.items').scrollTop(0);
  }
}

function tab(move) {
  const currentIndex = parseInt($('.focus').attr('tabIndex')); //获取目前带有focus的元素的tabIndex
  const next = currentIndex + move; //设置移动位置
  const items = document.querySelectorAll('li'); //遍历所有的li元素
  const targetElement = items[next]; //将位置与遍历结果对应
  if(targetElement == undefined){ //如果没有可供选择的目标
    return; //中止函数
  }
  $('.focus').attr("class",""); //清除原有效果
  targetElement.className = "focus"; //设置新效果
  tab_location = next;
  load()
}

function load() {
  switch(tab_location) {
    case 0: //简介
      getInfo();
      break;
    case 1: //评论
      getComments();
      break;
  }
}

function softLeft() {
  switch(tab_location) {
    case 0: //简介
      break;
    case 1: //评论
      break;
  }
}

function enter() {
  switch(tab_location) {
    case 0: //简介
      break;
    case 1: //评论
      break;
  }
}
//设置触发器
document.activeElement.addEventListener('keydown', handleKeydown);

/*  刚开应用该干啥  */
//设置播放内容
playV(getQueryVar('aid'),getQueryVar('bvid'),'1');
getInfo();
