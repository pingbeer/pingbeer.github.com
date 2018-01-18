/**
 * Created by ZNX on 2015/12/14.
 */
var PropTypes = React.PropTypes;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var DefaultRoute = ReactRouter.DefaultRoute;
var RouteHandler = ReactRouter.RouteHandler;
var Redirect = ReactRouter.Redirect;
var NotFoundRoute  = ReactRouter.NotFoundRoute;
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var ua = window.navigator.userAgent;
var osType = /android/i.test(ua)?1:2;
var inWeixin = /MicroMessenger/i.test(ua);
var notSupportVersion=false;
//埋点区分App还是微信
var  statisticsPre = '_WX';
// var statisticsFlag = 'WX_'
if(inWeixin){
    statisticsPre  = '_WX';
    // statisticsFlag = 'WX_'
}else{
    statisticsPre = '_APP';
    // statisticsFlag = 'APP_'
}
// inWeixin =false;


   var  closeWebview = function(){
        // location.href = TRADER_HOST+"/login";
       // alert("登录信息过期了")
        location.href = "#/authGo";
    }
    var _ncp = _ncp || [];
var pageCountFuc = function(customUrl,trackPageView,openId){
        if(ifStatistics) {
            //埋点初始化
            _ncp.push(['setUserId', openId]);
            var host = STATISTICSHOST;
             _ncp.push(['setTrackerUrl', "https://" + host + "/unc"]);
            _ncp.push(['setSiteId', 7]);
            _ncp.push(['setCustomUrl', customUrl]);
            _ncp.push(['trackPageView', trackPageView]);
             var d = document, g = d.createElement('script'), s = d.getElementsByTagName('head')[0];
             g.type = 'text/javascript';
             g.async = true;
             g.defer = true;
             g.src = 'https://' + host + '/nc.js';
             s.appendChild(g);
        }else{
            _ncp = [];
        }
    }

var Header = React.createClass({displayName: "Header",
    getDefaultProps: function () {
        return ({
            title:"我的流量“银行”",
            showLogo:"",
            showRule:"",
            showBless:"none",
            showSurrender:"none",
            showGoBlessHome:"none",
            showHistory:'none',
            showCardSignRoles:'none'

        })
    },
    blessHome:function(){
        // if(this.props.userInfo.userInfo.quotaState == '3'){
        //     this.refs.notAllowBless.open()
        // }else{
           location.hash = '#/blessHome'
        // }
    },
    
    render:function(){
        var title = this.props.title;
        var showRule =this.props.showRule;
        var showLogo =this.props.showLogo;
        var showBless =this.props.showBless;
        var showSurrender = this.props.showSurrender;
        var showGoBlessHome = this.props.showGoBlessHome;
        var showHistory = this.props.showHistory;
        var showCardSignRoles = this.props.showCardSignRoles;
      
        return (
            React.createElement("div", {style: {marginTop: '1rem',width:'100%'}}, 


                React.createElement("div", {style: {width:"100%",height:"2.6rem",verticalAlign: "middle",marginTop:"0.5rem",marginBottom:"1rem"}}, 
                    React.createElement("img", {style: {width:"27%",position:"absolute",left:"0.8rem",top: "1.25rem",display:showLogo}, src: "assets/images/base/logo.png"}), 
                    React.createElement("h1", {style: {fontSize: "1.5rem",width: "100%",color: "#FFF",fontWeight:" bold",position: "absolute",width: "14rem",left: "50%",marginLeft: "-7rem", top: "0rem",  marginTop:"1.2rem", textAlign: "center"}}, title), 
                    React.createElement("a", {href: "#/user/rule", style: {display:showRule}}, React.createElement("img", {style: {width: "28%",top: "0.8rem",position:"absolute",right:"0"}, src: "assets/images/myDataBank/bl.png"})), 
                    /* <a href="#/blessHome" style={{display:showBless}}><img style={{width: "20%",top: "0.8rem",position:"absolute",right:"0"}} src='assets/images/myDataBank/baofudai.png'/></a>*/
                    React.createElement("a", {onClick: this.blessHome.bind(this), style: {display:showBless}}, React.createElement("img", {style: {width: "20%",top: "0.8rem",position:"absolute",right:"0"}, src: "assets/images/myDataBank/baofudai.png"})), 
                    React.createElement("a", {href: "#/surrender", style: {display:showSurrender}}, React.createElement("span", {style: {top: "1rem",position:"absolute",right:"0.5rem",fontSize:'1.4rem',fontWeight:"bold"}}, "更多")), 
                    React.createElement("a", {href: "#/blessHome", style: {display:showGoBlessHome}}, React.createElement("span", {style: {top: "0.9rem",position:"absolute",right:"0.5rem",fontSize:'1.2rem',fontWeight:"normal",backgroundColor:"#014F87",borderRadius: '2rem',padding:"0.2rem 1rem"}}, "福袋首页")), 
                    React.createElement("a", {href: "#/signFlowBagHistory", style: {display:showHistory}}, React.createElement("span", {style: {top: "0.9rem",position:"absolute",right:"0.5rem",fontSize:'1.4rem',fontWeight:"normal",backgroundColor:"#014F87",borderRadius: '2rem',padding:"0.2rem 1rem"}}, "我的签约包")), 
                    React.createElement("a", {onClick: this.props.showCardAlert, style: {display:showCardSignRoles}}, React.createElement("span", {style: {top: "0.9rem",position:"absolute",right:"0.5rem",fontSize:'1.4rem',fontWeight:"normal",backgroundColor:"#014F87",borderRadius: '2rem',padding:"0.2rem 1rem"}}, "签约包细则"))
                )
                
            )

        )
    }
});


var Footer = React.createClass({displayName: "Footer",
    mixins:[
        //Reflux.connect(HomeRoomStore, "data"),
        Reflux.connect(pointStore, "data")
    ],
    propTypes: {
        navList: PropTypes.array.isRequired
    },
    componentDidUpdate:function(){
        //console.log( window.localStorage.getItem('signCardFlag') )
    },
    getDefaultProps: function () {
        return ({
            navList: [
                {
                    //icon:'check-square-o',
                    // icon:'assets/images/homePage/home-icon.png',
                    icon:'icon-home',
                    size:'2rem',
                    title: '首页',
                    url: '#/index',
                    style:{letterSpacing:'0',marginLeft:'0.2rem',fontSize:'1.3rem'},
                    width:'32%'
                },
                {
                    //  icon:'assets/images/homePage/recharge-icon.png',
                    icon:'icon-recharge',
                    title: '提取流量',
                    url: '',
                    style:{letterSpacing:'0',marginLeft:'0.4rem',fontSize:'1.3rem'},
                    width:"28%"
                },
                {
                    //icon: 'user',
                    // icon:'assets/images/base/icon3.png',
                    icon:'icon-my',
                    title: '我的账户',
                    url: '#/user',
                    style:{letterSpacing:'0',marginLeft:'0.4rem',fontSize:'1.3rem'},
                    width:'27%'
                }
            ]
        })
    },
    componentDidMount:function(){
        //获取提取流量按钮增加二级菜单
        // var nav0 = $("#nav_0");
        // var nav1 = $("#nav_1");
        // var dropUp = $("#dropUp");
        // //获取提取流量按钮增加二级菜单
        // var dropUp0 = $("#dropUp0");
        // // nav1.click(function(){
        // //     $("#dropUp").toggle();
        // // });
        // //获取提取流量按钮增加二级菜单
        // // nav0.click(function(){
        // //     $("#dropUp0").toggle();
        // //     if($("#dropUp0").css('display') == 'block'){
        // //         pointActions.searchSignStatus('signed');
        // //     }
        // // });
        // $(".nav_item").click(function(){
        //     $(this).addClass("active").siblings().removeClass("active");
        //     if($(this).attr("id")!="nav_1"){
        //         dropUp.hide();
        //     }
        //     if($(this).attr("id")!="nav_0"){
        //         dropUp0.hide();
        //     }
        //     //console.log($(this).attr("id"));
        // });
        // dropUp.click(function(){
        //     dropUp.hide();
        // });
        // //获取提取流量按钮增加二级菜单
        // dropUp0.click(function(){
        //     dropUp0.hide();
        // });
        // $(document).bind('click', function(e) {
        //     var e = e || window.event; //浏览器兼容性
        //     var elem = e.target || e.srcElement;
        //     while (elem) { //循环判断至跟节点，防止点击的是div子元素
        //         if (elem.id && (elem.id == 'nav_0' || elem.id == 'nav_1' )) {
        //             return;
        //         }
        //         //if (elem.id && (elem.id == 'nav_1' )) {
        //         //    return;
        //         //}
        //         elem = elem.parentNode;
        //     }
        //     dropUp0.hide(); //点击的不是div或其子元素
        //     dropUp.hide();
        // });

        //获取签约状态  接口未确定
        //pointActions.searchSignStatus();
    },
    getVol:function(url){
        // if(url == "#/index"){
        //     TraderActions.getRestData();
        // }
        location.href = url;
    },
    rechargeView:function(e){
      if(window.localStorage.getItem('userInfo') != undefined && window.localStorage.getItem('userInfo') != ''
      && window.localStorage.getItem('userInfo') != null){
          var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
          if(userInfo.quotaState == '3' && (e.target.innerHTML == '提取流量'|| e.target.innerText == '提取流量')){
              e.preventDefault();
              this.refs.notAllowRecharge.open()
          }else if(userInfo.quotaState != '3' && (e.target.innerHTML == '提取流量' || e.target.innerText == '提取流量')){
              e.preventDefault();
              location.hash = '#/recharge'
          }
      }
    },
    closeNotAllowRecharge:function(){
        this.refs.notAllowRecharge.close() ;
    },
    render: function () {
        var notEnoughHref2 = decodeURIComponent(HONGBAOURL);
         var wxDisplay = inWeixin ? 'display' : 'none';
         var wxTop = inWeixin ? '20%' : '32%';
        var hasLocation;
        var signCardFlag;
        // if(window.localStorage.getItem('signCardFlag') != '' && window.localStorage.getItem('signCardFlag') != null
        //     && window.localStorage.getItem('signCardFlag') != undefined){
        //     signCardFlag = JSON.parse(window.localStorage.getItem('signCardFlag'));
        // }
        // if( (window.location.hash == '#/' || window.location.hash == '#/index') && signCardFlag != ''
        // && signCardFlag != undefined && signCardFlag != null){
        //     hasLocation = signCardFlag.kbn === '0' ? '/signFlowBag' :  '/signFlowBagHistory';
        // }else{
        //     hasLocation = '/signFlowBagHistory'
        // }
        if(window.location.hash=="#/recharge"){
            // $("#nav_1").addClass("active").siblings().removeClass("active");
            $("#nav_1").addClass("nav_active");
            $("#nav_2").removeClass("nav_active");
        }else if(window.location.hash.indexOf("#/user") > -1){
             $("#nav_2").addClass("nav_active");
            $("#nav_1").removeClass("nav_active");
        }else{
             $("#nav_1").removeClass("nav_active");
            $("#nav_2").removeClass("nav_active");
        }

        var list = this.props.navList.map(function (nav,index) {
            var active = window.location.hash == nav.url ? "active" : "";
            var className = "col-xs-4 " + active;
            return (
                React.createElement("li", {key: "nav_" + index, id: "nav_" + index, className: "col-xs-4 nav_item"}, 

                        React.createElement("a", {href: nav.url, onClick: this.rechargeView}, 
                            React.createElement("p", null, 
                                /*<i className={"icon fa fa-"+nav.icon}></i>&nbsp;*/
                                /* <img src={nav.icon} style={{width:nav.width}}/> */
                                React.createElement("i", {className: nav.icon, style: {fontSize:nav.size}}), 
                                React.createElement("span", {className: "title", style: nav.style}, nav.title)
                            )
                        )

                )
            );
        }.bind(this));
        // if(window.location.hash!='#/buy') {
        //     $("#dropUp").hide();
        //     //console.log("here");
        // }
        return (
            React.createElement("div", null, 
                /* <div id="dropUp" style={{display:'none'}} tabIndex="0" onblur='alert("ffff");' >
                    <ul>
                        <li >
                            <ReactRouter.Link to="/buy/account" params={{type:'account'}}>
                                <p style={{borderBottom:"1px solid rgba(0, 118, 172, 0.7)"}}>
                                    <span style={{fontSize:'1.2rem'}}>流量账户充值</span>
                                </p>
                            </ReactRouter.Link>
                        </li>
                    </ul>
                </div> */
            /*
            首页“”提取流量“”增加的二级菜单：一键提取，签约流量包
            */
                /* <div id="dropUp0" style={{display:'none',position: 'absolute',bottom: '44px',marginLeft: '-15px'}} tabIndex="0">
                    <ul>
                        <li >
                            <p onClick={this.rechargeView} style={{borderBottom:"1px solid rgba(0, 118, 172, 0.7)"}}>
                                <span style={{fontSize:'1.2rem'}}>一键提取</span>
                            </p>
                        </li>
                        <li >
                            <ReactRouter.Link to={hasLocation}>
                                <p style={{borderBottom:"1px solid rgba(0, 118, 172, 0.7)"}}>
                                    <span style={{fontSize:'1.2rem'}}>签约流量包</span>
                                </p>
                            </ReactRouter.Link>
                        </li>
                    </ul>
                </div> */
                
                    /*

                    * */
                
                React.createElement("nav", {id: "nav", style: this.props.style}, 
                    React.createElement("ul", null, 
                        list
                    )
                ), 

                React.createElement(BootstrapModal, {ref: "notAllowRecharge"}, 
                    React.createElement("div", {style: {position: 'relative'}}, 
                        React.createElement("div", null, 
                            React.createElement("img", {src: "assets/images/base/FC1.png", style: {"width": '100%'}})
                        ), 
                        React.createElement("div", {style: {position: 'absolute', top: '5%', zIndex: 999, right: '0'}}, 
                            React.createElement("a", {href: "javascript:;", onClick: this.closeNotAllowRecharge}, 
                                React.createElement("img", {src: "assets/images/recharge/close-small.png", style: {"width": '50%'}})
                            )
                        ), 
                        React.createElement("div", {style: {
                            position: 'absolute',
                            top: wxTop,
                            zIndex: 999,
                            textAlign: 'center',
                        }}, 
                            React.createElement("div", {style: {padding:'18px'}}, 
                                React.createElement("span", {style: {"fontSize": "1.5rem"}}, "亲，您目前尚有透支流量未归还，暂时不能使用此功能！"), 
                                React.createElement("span", {style: {"fontSize": "1.5rem"}}, "请您尽快进行流量账户充值，系统将自动为您归还已透支的流量。"), 
                                /*金额：<span style={{"color":"#02fffd"}}>{price}</span>元*/
                                 React.createElement("div", {style: {textAlign: 'center',marginTop:'1rem'}}, 
                                    React.createElement(ReactRouter.Link, {to: "/buy/account", params: {type: 'account'}, onClick: this.closeNotAllowRecharge}, 
                                        React.createElement("img", {src: "assets/images/recharge/notEnough1.png", style: {"width": '42%',marginBottom:'0.5rem'}})
                                    ), React.createElement("br", null), 

                                    React.createElement("a", {href: notEnoughHref2, style: {display:wxDisplay}}, 
                                        React.createElement("img", {src: "assets/images/recharge/notEnough2.png", style: {"width": '42%'}})
                                    )

                                    /*                                <a href="javascript:;" onClick={this.cancelNotEnoughFlow}>
                                    <img src='assets/images/base/close.png' style={{"width":'90%'}} />
                                    </a>*/
                                )

                            )
                        )
                    )
                )
            )



        )
    }
});


var openShare = function(){
    var noncestr;
    var signature;
    var timestamp;
    $.ajax({
        url:IFSHAREURL,
        dataType:'json',
        type:'get',
        success:function(res){
            noncestr = res.noncestr;
            signature = res.signature;
            timestamp = res.timestamp;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: APPID, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: noncestr, // 必填，生成签名的随机串
                signature: signature, // 必填，签名，见附录1
                jsApiList: ['showOptionMenu','hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.checkJsApi({
                    jsApiList: ['showOptionMenu','hideOptionMenu'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    }
                });
                 wx.hideOptionMenu();
                // if( location.href.indexOf('#/share/') > -1 || location.href.indexOf('#/open/') > -1
                //     || location.href.indexOf('#/bag/') > -1 ){
                //     //wx.showAllNonBaseMenuItem();
                //     wx.showOptionMenu();
                // }else{
                //     //wx.hideAllNonBaseMenuItem();
                //     wx.hideOptionMenu();
                // }
            });
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });
        }.bind(this),
        error:function(xhr,status,err){

        }.bind(this)
    });
};

var App = React.createClass({displayName: "App",
    mixins:[ReactRouter.State],
    getInitialState:function(){
        return({
            isSigned:'1'
        })
    },
    componentWillReceiveProps:function(nextProps){
        if(inWeixin){
            openShare();
        }
    },
    componentDidMount:function(){
        if(inWeixin){
            openShare();
        }
    },
    render: function () {
        var height= window.innerHeight;
        //var showFlag = (window.location.hash == '#/' || window.location.hash == '#/index') ? 'none' : 'block';
        document.body.style.background="url(assets/images/base/bg.png)";
        document.body.style.backgroundSize="cover";
        document.body.style.backgroundRepeat='no-repeat';
        var homePage;
        if(location.hash == '#/' || location.hash == '#/index'){
            homePage = 'none';
        }else{
            homePage = 'block';
        }
        //var foot = "";
        //if(this.getPath()!="/"){
        //    foot = <Footer />;
        //}
        return (
                React.createElement("div", {className: "container", style: {height:height,overflow:'hidden'}}, 
                    React.createElement(RouteHandler, null), 
                     React.createElement(Footer, {style: {display:homePage}})
                ) 
        )
    }
});
var SelectInput = React.createClass({displayName: "SelectInput",
    getInitialState:function(){
        return({
            TempArr:this.props.phone,//存储option
            name1:'makeupCo',
            name2:'makeupCoSe',
            displayFlag:''
        })
    },
    setfocus:function(this_){
        $("#typenum").css({"display":"block","width":this.props.inputStyle.widthUl});
        var select = $("#typenum");
        //$("#typenum").children().remove();
        $("#typenum").find('li').remove();
        for(i=0;i<this.props.phone.length;i++){
            var option = $("<li></li>").text(this.props.phone[i]);
            var that = this;
            option.click(function(this_) {
                //$(this_.target).prev("input").val($(this_.target).find("option:selected").text());
                $('#makeupCo').val($(this_.target).context.textContent);
                $("#typenum").css({"display":"none"});
                that.props.setBag();
            });
            select.append(option);
        }
    },
    setinput:function(this_){
        var select = $("#typenum");
        //select.html("");
        select.find('li').remove();
        for(i=0;i<this.props.phone.length;i++){
            //若找到以txt的内容开头的，添option
            if(this.props.phone[i].substring(0,this_.target.value.length).indexOf(this_.target.value)==0){
                var option = $("<li ></li>").text(this.props.phone[i]);
                var that = this;
                option.click(function(this_) {
                    //$(this_.target).prev("input").val($(this_.target).find("option:selected").text());
                    $('#makeupCo').val($(this_.target).context.textContent);
                    $("#typenum").css({"display":"none"});
                    that.props.setBag();
                });
                select.append(option);
            }
        }
    },
    changeF: function(this_) {
        //$(this_.target).prev("input").val($(this_.target).find("option:selected").text());
        $('#makeupCo').val($(this_.target).context.text);
        $("#typenum").css({"display":"none"});
    },
    componentDidMount:function(){
        try{
            var _this = this;
            $(function(){
                /*先将数据存入数组*/
                $("#typenum li").each(function(index, el) {
                    _this.props.phone[index] = $(this).text();
                });
                $(document).bind('click', function(e) {
                    var e = e || window.event; //浏览器兼容性
                    var elem = e.target || e.srcElement;
                    while (elem) { //循环判断至跟节点，防止点击的是div子元素
                        if (elem.id && (elem.id == 'typenum' || elem.id == "makeupCo")) {
                            return;
                        }
                        elem = elem.parentNode;
                    }
                    $('#typenum').css('display', 'none'); //点击的不是div或其子元素
                });
            });
            if(!CARDSIGNFLAG && window.location.hash == '#/signFlowBag'){
               $('#makeupCo').attr('readonly','readonly')
            }
        }catch(e){
            alert(e)
        }

    },
    componentWillMount:function(){
        //this.displayFlag  = this.props.phone.length > 0 ? 'inline-block' : 'none';
    },
    render:function(){
        if(this.props.phone != undefined){
            var displayFlag = this.props.phone.length > 0 ? 'inline-block' : 'none';
        }
        return(
            React.createElement("div", {style: {float:'left',width: this.props.inputStyle.widthDiv}}, 
                React.createElement("input", {type: "tel", name: "makeupCo", maxLength: "11", ref: "phoneNum", id: "makeupCo", onChange: this.props.setBag, style: {width:this.props.inputStyle.width,background:'#3785c7',zIndex:'999',
                    marginTop:this.props.inputStyle.marginTop,height: this.props.inputStyle.height, fontSize: '1.5rem'
                ,  borderRadius:'15px',textAlign:'center'}, onClick: this.setfocus.bind(this), onInput: this.setinput.bind(this), placeholder: "请选择或输入"}), 
                React.createElement("ul", {name: "makeupCoSe", id: "typenum", size: "10", onChange: this.changeF.bind(this), style: {display:'none',position:'absolute',width:this.props.inputStyle.widthUl,background:'rgb(0, 158, 220)',
                    borderRadius:'8px',zIndex:'999',textAlign:'center',maxHeight:'15rem',overflow:'scroll'}}, 
                    React.createElement("span", {style: {marginTop: '9px',display: displayFlag,fontSize:'1.4rem'}}, "请选择号码")
                /*
                 <option onClick={this.changeF.bind(this)}>13797294221</option>
                 <option onClick={this.changeF.bind(this)}>13797294221</option>
                 <option onClick={this.changeF.bind(this)}>13237294561</option>
                 <option onClick={this.changeF.bind(this)}>13567294221</option>
                 <option onClick={this.changeF.bind(this)}>13333294621</option>
                 <option onClick={this.changeF.bind(this)}>13222294226</option>
                 <option onClick={this.changeF.bind(this)}>13357294221</option>
                 <option onClick={this.changeF.bind(this)}>13678294221</option>*/
                )
            )
        )
    }
});
var routes = (
    React.createElement(Route, {path: "/", handler: App}, 
        React.createElement(Route, {name: "index", path: "index", handler: IndexBox}), 
        React.createElement(Route, {name: "recharge", path: "recharge", handler: RechargeBox}), 
        React.createElement(Route, {name: "buy", path: "buy", handler: BuyBox}), 
        React.createElement(Route, {name: "buyData", path: "/buy/:type", handler: BuyBox}), 
        React.createElement(Route, {handler: UserBox, name: "user", path: "user"}, 
            React.createElement(Route, {name: "getDetail", path: "getDetail", handler: GetDetailBox}), 
            React.createElement(Route, {name: "rechargeDetail", path: "rechargeDetail", handler: RechargeDetailBox}), 
            React.createElement(Route, {name: "honor", path: "honor", handler: HonorBox}), 
            React.createElement(Route, {name: "rule", path: "rule", handler: RuleBox}), 

            React.createElement(DefaultRoute, {handler: EntryBox})
        ), 
        React.createElement(Route, {name: "blessHome", path: "/blessHome", handler: BlessHomeBox}), 
        React.createElement(Route, {name: "point", path: "/point", handler: PointBox}), 
        React.createElement(Route, {name: "contract", path: "/contract", handler: Contract}), 
        React.createElement(Route, {name: "surrender", path: "/surrender", handler: Surrender}), 
        React.createElement(Route, {name: "surrenderSuccess", path: "/surrenderSuccess/:success", handler: SurrenderSuccess}), 
        React.createElement(Route, {name: "wrap", path: "/wrap", handler: WrapBox}), 
        React.createElement(Route, {name: "send", path: "/send", handler: SendBox}), 
        React.createElement(Route, {name: "receive", path: "/receive", handler: ReceiveBox}), 
        React.createElement(Route, {name: "bag", path: "/bag/:id", handler: BagBox}), 
        React.createElement(Route, {name: "open", path: "/open/:id", handler: OpenBox}), 
        React.createElement(Route, {name: "share", path: "/share/:id", handler: ShareBox}), 
        React.createElement(Route, {name: "paySuccess", path: "/paySuccess", handler: PaySuccess}), 
        React.createElement(Route, {name: "payFail", path: "/payFail", handler: PayFail}), 
        React.createElement(Route, {name: "authGo", path: "/authGo", handler: AuthGoBox}), 
        React.createElement(Route, {name: "notice", path: "/notice", handler: NoticeBox}), 
        /*<Route name="myBill" path="myBill" handler={MyBillBox}/>
        <Route name="shareBill" path="shareBill" handler={ShareBillBox}/>
        <Route name="lookBill" path="lookBill/:id" handler={LookBillBox}/>*/
         /*签约流量包

         */
        React.createElement(Route, {name: "signFlowBag", path: "/signFlowBag", handler: SingCardBox}, 

            React.createElement(Route, {name: "cardMessage", path: "cardMessage", handler: SignCardMessageBox}), 
            React.createElement(Route, {name: "agreement", path: "agreement", handler: AgreementBox}), 
            React.createElement(DefaultRoute, {handler: SignCardMessageBox})
        ), 
        React.createElement(Route, {name: "signFlowBagHistory", path: "/signFlowBagHistory", handler: SignCardHistoryBox}, 

            React.createElement(Route, {name: "bagHistory", path: "bagHistory", handler: SignCardListBox}), 
            /* <Route name="SignCardDetail" path="SignCardDetail" handler={SignCardDetailBox} />*/
            React.createElement(Route, {name: "SignCardDetail", path: ":id", handler: SignCardDetailBox}), 
            React.createElement(DefaultRoute, {handler: SignCardListBox})
        ), 
        React.createElement(Route, {name: "quotaDetails", path: "/quotaDetails", handler: QuotaDetails}), 
        React.createElement(Route, {name: "quotaSign", path: "/quotaSign/:volume", handler: quotaSign}), 
        React.createElement(Route, {name: "quotaSignSurrender", path: "/quotaSignSurrender", handler: cardSignSurrender}), 
        React.createElement(Route, {name: "quotaSignContent", path: "/quotaSignContent/:agreement", handler: QuotaSignContent}), 
        /*<Route name="messageCenter" path="/messageCenter" handler={Messagecenter}>
            <Route name="detail" path=":id" handler={MessageDetails} />
            <DefaultRoute handler={MessageList}/>
        </Route>*/
        React.createElement(NotFoundRoute, {handler: AuthGoBox}), 
        React.createElement(DefaultRoute, {handler: IndexBox})
    )
);

ReactRouter.run(routes, function (Handler) {
    // React.render(<Handler/>, document.body);
    ReactDOM.render(React.createElement(Handler, null), document.body);
});

FastClick.attach(document.body);

