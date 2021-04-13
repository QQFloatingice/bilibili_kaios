
/*  通用函数  */
//添加视频项目

//跨域设置
$.ajaxSettings.xhr = function () {
    try {
        return new XMLHttpRequest({ mozSystem: true });
    } catch (e) { }
}; 
//跨域
function ajax(method, url, data, callback, progress, type) {
    method = method.toUpperCase();
    type = type || 'json';
    var xhr = new XMLHttpRequest({ mozSystem: true });
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) { 
            if (xhr.status === 200) { 
                var text = JSON.parse(xhr.responseText); 
                callback(false, text);
            } else {
                callback(xhr.status + xhr.responseText);
            }
        }
    };
    if (data) {
        var urlstr = [];
        for (var i in data) {
            urlstr.push(i + '=' + encodeURIComponent(data[i]));
        } 
        data = urlstr.join('&');
        if ((method === 'GET' || method === 'DELETE') && data) {
            url += /\?/.test(url) ? '&' + data : '?' + data;
        }
    }

    xhr.open(method, url, true);
    if (method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhr.withCredentials = true;
    xhr.send(data);
}
function ajax_get(url, callback, type) {
    ajax('GET', url, {}, callback, null, type);
}
function ajax_post(url, data, callback, progress) {
    ajax('POST', url, data, callback, progress, 'json');
}

//比较版本号
function compareVer(oldver,newver)
{
	var a = oldver.split('.');
	var b = newver.split('.');
	
	for(var i = 0;i<a.length;i++)
	{
		var aa = parseInt(a[i]);
		var bb = parseInt(b[i]);
		if(bb>aa)
		{
			return true;
		}
		else if(bb===aa)
		{
			continue;
		}
		else if(bb<aa)
		{
			return false;
		}
	}
	return false;
}

function appendV(title, author, image, tabIndex) {
  var titleN = title
  if(titleN.length > 20){
    titleN = titleN.substr(0,20) + '…';
  }
  $('.items').append("<div class='item' tabIndex='" + tabIndex + "'><img class='cover' src='" + image + "'/><div class='title'>" + titleN + "</div><div class='imgUP'>UP</div><div class='author'>" + author + "</div></div>")
}
//添加UP主
function appendA(nick,sub,image,tabIndex) {
  $('.items').append("<div class='item' tabIndex='" + tabIndex + "'><img class='head' src='" + image + "'/><div class='title' style='left: 63px'>" + nick + "</div><div class='author' style='left: 63px'>粉丝：" + sub + "</div></div>")
}
//添加直播
function appendZ(nick, sub, image, tabIndex) {
    $('.items').append("<div class='item' tabIndex='" + tabIndex + "'><img class='head' src='" + image + "'/><div class='title' style='left: 63px'>" + nick + "</div><div class='author' style='left: 63px'>rank：" + sub + "</div></div>")
}

//打开视频
function openV() {
  const currentIndex = document.activeElement.tabIndex;
  window.location.href = './player/index.html?aid=' + aid[currentIndex] + '&bvid=' + bvid[currentIndex] + '&title=' + title[currentIndex]
}
//加载搜索框
function loadSearch() {
  $('.items').empty();
  $('.items').append("<input id='searchInput' class='input' type='text' tabIndex='0' />");
  document.querySelectorAll('#searchInput')[0].focus();
}
//设置导航栏
function softkey(left,center,right) {
  $('#softkey-left').text(left);
  $('#softkey-center').text(center);
  $('#softkey-right').text(right);
}
/*  获取信息  */
//设置方法
typeHome = ['item.title','item.author','item.pic','item.aid','item.bvid'];
typeAuthor = ['item','result.nick[r]','result.sub[r]','result.pic[r]'];
typeAuthorV = ['item.title','item.author','item.pic','item.aid','item.bvid'];
typeHotV = ['item.title','item.author','item.pic','item.aid','item.bvid'];
typeSearch = [];

//dict：方法（遍历时用于解析的列表：【标题，作者，配图，视频AV号，视频BV号】）（以item开头）
//each：遍历的位置（以result开头）

//获取视频列表
function getVList(error,data) {


    if (error) {
        alert(error);
    } else {
        if (data.code != 0) {
            alert(data.message);
            return;
        }
        $('.items').empty() //清空列已有的列表
        title = []
        author = []
        aid = []
        bvid = []
        image = []
         
        $.each(data.data.list, function (r, item) {
            title.push(item.title);
            author.push(item.author);
            if (item.pic.substr(0, 2) == '//') {
                image.push('https:' + item.pic);
            } else {
                image.push(item.pic);
            }

            aid.push(item.aid);
            bvid.push(item.bvid);
        })
        //建立列表
        $.each(title, function (r, i) {
            appendV(i, author[r], image[r], r + '');
        })
        //对焦
        document.querySelectorAll('.item')[0].focus();
      //退出
    } 
};


//获取视频列表
function getVList2(error, data) {


    if (error) {
        alert(error);
    } else {
        if (data.code != 0) {
            alert(data.message);
            return;
        }
        $('.items').empty() //清空列已有的列表
        title = []
        author = []
        aid = []
        bvid = []
        image = []

        $.each(data.data.list.vlist, function (r, item) {
            title.push(item.title);
            author.push(item.author);
            if (item.pic.substr(0, 2) == '//') {
                image.push('https:' + item.pic);
            } else {
                image.push(item.pic);
            }

            aid.push(item.aid);
            bvid.push(item.bvid);
        })
        //建立列表
        $.each(title, function (r, i) {
            appendV(i, author[r], image[r], r + '');
        })
        //对焦
        document.querySelectorAll('.item')[0].focus();
        //退出
    }
};


//获取作者列表
function getAList(dict,each) {
  $('.items').empty() //清空列已有的列表
  if(navigator.onLine == false) {
    $('.items').append('请连接互联网！');
    return;
  }
  $('.items').append('正在加载…') //展示加载信息
  
  
  //创建用于存储信息的函数
  uid = []
  var nick = [];
  var sub = [];
  var image = []; 
    var result = localStorage.getItem('subscription') //从本地获取信息 
  try {
    var result = JSON.parse(result)
  }catch(e){
    localStorage.setItem('subscription',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
    localStorage.setItem('studio',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
    getAList(dict,each)
  }
  
  
  $('.items').empty() //清空列已有的列表
  
  if(result.uid.length == 0){
    $('.items').append('您还没有添加过UP主哦<br>按“添加”添加试试')
    return
    }  

    for (var i = 0; i < result.uid.length; i++) {
        uid.push(result.uid[i]);
        nick.push(result.nick[i]);
        sub.push(result.sub[i]);
        image.push(result.pic[i]); 
    } 
  //建立列表
  $.each(nick,function(r,i) {
    appendA(i,sub[r],image[r],r + '');
  })
  //对焦
  document.querySelectorAll('.item')[0].focus();
};




//获取直播列表
function getZList() {
    $('.items').empty() //清空列已有的列表
    if (navigator.onLine == false) {
        $('.items').append('请连接互联网！');
        return;
    }
    $('.items').append('正在加载…') //展示加载信息


    //创建用于存储信息的函数
    uid = []
    var nick = [];
    var sub = [];
    var image = [];
    var result = localStorage.getItem('studio') //从本地获取信息 
    try {
        var result = JSON.parse(result)
    } catch (e) {
        localStorage.setItem('subscription', "{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
        localStorage.setItem('studio', "{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
        getZList()
    } 

    $('.items').empty() //清空列已有的列表

    if (result.uid.length == 0) {
        $('.items').append('您还没有添加过UP主哦<br>按“添加”添加试试')
        return
    }

    for (var i = 0; i < result.uid.length; i++) {
        uid.push(result.uid[i]);
        nick.push(result.nick[i]);
        sub.push(result.sub[i]);
        image.push(result.pic[i]);
    }
    //建立列表
    $.each(nick, function (r, i) {
        appendZ(i, sub[r], image[r], r + '');
    })
    //对焦
    document.querySelectorAll('.item')[0].focus();
};

function check_update(pack_name, version) {
  if($.cookie('update_checked') == true) {
    return;
  } 
  $.getJSON('http://sss.wmm521.cn/kaios/bilibili_ver.json?_='+(new Date().getTime()), function(result) {
    var latest_version = result.version;
    if(compareVer(version,latest_version))
	{
		if(confirm('【检测到新版本】\n版本号：' + latest_version + '\n是否下载新版本？')) {
        window.open(result.downloadUrl)
      }else{
      }
	}
    $.cookie('update_checked', true)
  })
}


/*  D-Pad  */
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
      if(opened_VList) {
        load()
      }else{
        window.close()
      }
      
      break;
    case 'SoftLeft':
      refresh();
      break;
    case 'SoftRight':
      SoftRight()
      break;
    case '0':
      if(confirm('您真的要初始化吗？\n这会丢失你所有的数据！')) {
        localStorage.setItem('subscription',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
        localStorage.setItem('studio',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
        alert('已完成！');
      }else{
        alert('已取消！');
      }
      break;
    case '#':
      alert('By：白羊座的一只狼\n使用说明：\n1.此界面按0初始化\n2.播放界面按2调整音量');
      break;
  }
}
//设置导航键函数
var tab_location = 1;//设置header位置
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
  //关闭之前的ajax
  try{
    ajax.abort();
  }catch(e){}
  
  switch(tab_location) {
    case 0: //搜索
      loadSearch();
      softkey('搜索','播放','选项');
      break;
      case 1: //首页推荐
          {
              $('.items').empty() //清空列已有的列表
              if (navigator.onLine == false) {
                  $('.items').append('请连接互联网！');
                  return;
              }
              $('.items').append('正在加载…') //展示加载信息 
              ajax_get('http://api.bilibili.com/x/web-interface/ranking', getVList);
          }
      softkey('刷新','播放','选项');
      break;
    case 2: //关注
      getAList(typeAuthor,'result.uid')
      softkey('刷新','选择','添加');
      break;
   case 3: //直播
        getZList();
      softkey('刷新','观看','添加');
      break;
  }
  opened_VList = false //设置二级菜单状态
}

function add() {
  switch(tab_location) {
    case 2: //关注
      var id = prompt('输入UID：') //弹框请用户输入数据
      if(id.match(/[a-z]/i) != null || id.match(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/i) != null) { //正则验证输入的内容 确保只输入数字
        alert('请输入数字！')
        break;
      }
      var data = localStorage.getItem('subscription'); //读取数据
      data = JSON.parse(data); //将字符串转换为JSON
      data.uid.push(id); //将数据添加到JSON
      localStorage.setItem('subscription',JSON.stringify(data)) //将数组转换后存储数据
      break;
    case 3: //直播
      var id = prompt('输入直播的用户的UID(不是房间号)：') //弹框请用户输入数据
      if(id.match(/[a-z]/i) != null || id.match(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/i) != null) { //正则验证输入的内容 确保只输入数字
        alert('请输入数字！')
        break;
      }
      var data = localStorage.getItem('studio'); //读取数据
      data = JSON.parse(data); //将字符串转换为JSON
      data.uid.push(id); //将数据添加到JSON
      localStorage.setItem('studio',JSON.stringify(data)) //将数组转换后存储数据
      break;
  }
  $('.items').empty() //展示加载信息
  $('.items').append('请等待…') //展示加载信息
  refresh() //及时刷新数据
  load()
}

function searchData()
{
    var searchtext = $('#searchInput').val();
    var searchurl = "http://api.bilibili.com/x/web-interface/search/type?keyword=" + searchtext + "&search_type=video&page=1" 
    $.getJSON(searchurl, function (result) {

        $('.items').empty() //清空列已有的列表
        title = []
        author = []
        aid = []
        bvid = []
        image = []

        $.each(result.data.result, function (r, item) {
            title.push(item.title);
            author.push(item.author);
            if (item.pic.substr(0, 2) == '//') {
                image.push('https:' + item.pic);
            } else {
                image.push(item.pic);
            }

            aid.push(item.aid);
            bvid.push(item.bvid);
        })
        //建立列表
        $.each(title, function (r, i) {
            appendV(i, author[r], image[r], r + '');
        })
        //对焦
        document.querySelectorAll('.item')[0].focus();
    }) 
}

function refresh() {
  switch(tab_location) {
      case 0: //搜索
          searchData();
      break;
    case 1: //首页推荐
      load();
      break;
    case 2: //关注
      $.ajaxSettings.async = false; //临时设置为同步请求
      var data = localStorage.getItem('subscription'); //读取数据
      data = JSON.parse(data); //将字符串转换为JSON
      $.each(data.uid,function(r,item){ //给每一个uid更新数据
        $.getJSON('http://api.bilibili.com/x/space/acc/info?mid=' + item, function(result) {
          data.pic[r] = result.data.face //头像
          data.nick[r] = result.data.name //昵称
        })
        $.getJSON('http://api.bilibili.com/x/relation/stat?vmid=' + item, function(result) {
          data.sub[r] = result.data.follower //粉丝数
        })
      }) 
      localStorage.setItem('subscription', JSON.stringify(data)) //将数组转换后存储数据
      $.ajaxSettings.async = true; //记得改回来
      break;
      case 3: //直播
          $.ajaxSettings.async = false; //临时设置为同步请求
          var data = localStorage.getItem('studio'); //读取数据
          data = JSON.parse(data); //将字符串转换为JSON
          data.nick = new Array(data.uid.length);
          data.pic = new Array(data.uid.length);
          data.sub = new Array(data.uid.length);

          $.each(data.uid, function (r, item) { //给每一个uid更新数据 
              $.getJSON('http://api.bilibili.com/x/space/acc/info?mid=' + item, function (result) { 
                  data.nick[r] = result.data.name //名称 
                  data.pic[r] = result.data.face  //头像
                  data.sub[r] = result.data.rank //rank
              }) 
          }) 
          localStorage.setItem('studio', JSON.stringify(data)) //将数组转换后存储数据
          $.ajaxSettings.async = true; //记得改回来
      break;
  }
}

function enter() {
  switch(tab_location) {
      case 0: //搜索
          openV();
      break;
    case 1: //首页推荐
      openV();
      break;
    case 2: //关注
      if(opened_VList == false) {
        const currentIndex = document.activeElement.tabIndex;
          ajax_get('https://api.bilibili.com/x/space/arc/search?mid=' + uid[currentIndex] + '&pn=1', getVList2); 
        softkey('刷新','播放','选项');
        opened_VList = true
      }else{
        openV()
      }
      break;
    case 3: //直播
      const currentIndex = document.activeElement.tabIndex;
      var link = './live/index.html?uid=' + uid[currentIndex]
      window.location.href = link;
      break;
  }
}

function SoftRight() {
  switch(tab_location) {
    case 0: //搜索
      break;
    case 1: //首页推荐
      break;
    case 2: //关注
      add()
      break;
    case 3: //直播
      add()
      break;
  }
}
//设置触发器
document.activeElement.addEventListener('keydown', handleKeydown);

/*  刚开应用该干啥  */
//若第一次安装则初始化关注列表等信息
if(localStorage.getItem('subscription') == null || localStorage.getItem('studio') == null) {
  localStorage.setItem('subscription','')
  localStorage.setItem('studio','')
}

//检查更新
check_update('app://kai.baiyang.bilibili', '1.4')

//获取首页推荐
//getVList(typeHome,'result.data.list','http://25g0cabeb.nat123.fun/services/bilibili/homepage/get_homepage.py');
load()
