/**
 * Created by Administrator on 2017/4/12 0012.
 */
var SignCardHistoryBox = React.createClass({displayName: "SignCardHistoryBox",
    mixins:[
        Reflux.connect(pointStore, "data")
    ],
    getInitialState:function(){
        return({
           
        })
    },
    localStorage:function(){
        var save = function (key, value) {
            window.localStorage.setItem(key, typeof value == 'object' ? JSON.stringify(value) : value);
        };
        var get = function (key) {
            return window.localStorage.getItem(key) || null;
        };
        var remove = function (key) {
            window.localStorage.removeItem(key);
        };
        return {
            save:save,
            get:get,
            remove:remove
        }

    },
    componentDidMount:function(){
        //pointActions.getOrderList();
        var userInfo = JSON.parse(this.localStorage().get('userInfo'));
        var address = CLIENT_HOST+'/signFlowBagHistory'+statisticsPre;
        pageCountFuc(address,'signFlowBagHistoryPage',userInfo.wx_open_id||"");//统计进入流量签约包历史记录界面
    },
    componentDidUpdate:function(){

    },
    getDetail:function(id){
        pointActions.getOrderListDetail(id);
    },
    render:function(){
        return (
            React.createElement("div", null, 
                React.createElement(RouteHandler, {data: this.state.data, actionsPoint: this.pointStore, localStorage: this.localStorage})
            )
        )
    }
});
var SignCardListBox = React.createClass({displayName: "SignCardListBox",
    getDetail:function(id){
        //pointActions.getOrderListDetail(id);
        //this.refs.loadingSignHistory.open();
        ////点击订单详情时触发的埋点
        //_ncp.push(['trackEvent', 'WX', 'Click','default','qyllb_ddxq_open']);
    },
    getInitialState:function(){
        return({
            pointActions:this.props.actionsPoint
        })
    },
    componentDidUpdate:function(){
        //if(this.props.data.queryDetailSuccess == true){
        //    window.location.href = "#/signFlowBagHistory/SignCardDetail";
        //    this.refs.loadingSignHistory.close();
        //}
    },
    cancelLoadingSignHistory:function(){
        //this.refs.loadingSignHistory.close();
    },
    componentDidMount:function(){

    },
    componentWillMount:function(){
        if(this.props.data.orderHistory.length == 0){
            if(this.props.localStorage().get('signCardFlag') == null || this.props.localStorage().get('signCardFlag') == '' ||
                this.props.localStorage().get('signCardFlag') == undefined){
                pointActions.searchSignStatus('reloadConnect');
            }//在详情页面刷新会出现长度为0的情况
            else{
                this.props.data.orderHistory = JSON.parse(this.props.localStorage().get('signCardFlag')).signOrderInfoList;
            }
        }
    },
    openAgreementServe:function(){
        this.refs.agreementServe.open();
        //点击签约规则时触发的埋点
        _ncp.push(['trackEvent', 'WX', 'Click','default','qyllb_qygz_open']);
    },
    cancelAgreementServe:function(){
        this.refs.agreementServe.close();
    },
    render:function(){
        var orderList = $.map(this.props.data.orderHistory,function(list,index){
            var status = list.State == '2' ? '进行中':'已完成';
            var listDate = new Date(parseFloat(list.Date)).Format('yyyy/MM/dd');
            return(
            {
                /* <li className="list-group-item" onClick={this.getDetail.bind(this,list.signOrderId)}>
                 <div className="row">
                 <div className="col-xs-4">{listDate}</div>
                 <div className="col-xs-4">{status}</div>
                 <div className="col-xs-4">详情&nbsp;&nbsp;{'>'}</div>
                 </div>
                 </li>*/
            },
                React.createElement("li", {className: "list-group-item"}, 
                    React.createElement(Link, {to: "SignCardDetail", params: {id:list.signOrderId}}, 
                        React.createElement("div", {className: "row"}, 
                            React.createElement("div", {className: "col-xs-4"}, listDate), 
                            React.createElement("div", {className: "col-xs-4"}, status), 
                            React.createElement("div", {className: "col-xs-4"}, "详情  ", '>')
                        )
                    )
                )

            )
        }.bind(this));
        var cardHistory = React.createElement("div", {className: "order-history"}, 
            React.createElement("div", {className: "order-history-title", style: {textAlign:'center',marginTop:'12px'}}, 
            /* <span>订单记录</span>*/
                React.createElement("div", null, 
                    React.createElement("span", {style: {position:'absolute',color:'#10a5ef',fontWeight:'bold',fontSize:'1.8rem',marginTop:'1%',marginLeft:'-3.5rem'}}, "签约记录")
                ), 
                React.createElement("img", {src: "assets/images/signCard/signCardDetail1.png", style: {width:'43%'}})
            ), 
            React.createElement("ul", {className: "list-group"}, 
                React.createElement("li", {className: "list-group-item", style: {background:'#10a5ef',border:'none'}}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-xs-4", style: {color:'white'}}, "签约日期"), 
                        React.createElement("div", {className: "col-xs-4", style: {color:'white'}}, "签约状态"), 
                        React.createElement("div", {className: "col-xs-4"})
                    )
                ), 
                React.createElement("div", {style: {height:'30rem',overflowY:'scroll'}}, 
                     orderList
                )
                /*
                 <li className="list-group-item" onClick={this.getDetail}>
                 <div className="row">
                 <div className="col-xs-4">2017/12/24</div>
                 <div className="col-xs-4">进行中</div>
                 <div className="col-xs-4">详情&nbsp;&nbsp;{'>'}</div>
                 </div>
                 </li>

                 */
            ), 
            React.createElement(BootstrapModal, {ref: "agreementServe", title: "提示", onCancel: this.cancelAgreementServe}, 
                React.createElement("div", {className: "container", style: {background:'#0095d8'}}, 
                    React.createElement("div", {className: "car-sign-title", style: {border: 'none',
                            padding: '10px',background:'#028ac1',height:'4rem', margin:
                        'auto -15px'}}, 
                        React.createElement("h5", {style: {    letterSpacing: '0px', lineHeight: '1rem',
                                marginRight: '25px',whiteSpace:'nowrap'}}, "流量签约包功能使用规则")
                    ), 
                    React.createElement("div", null, 
                        React.createElement("img", {src: "assets/images/base/icon_x.png", onClick: this.cancelAgreementServe.bind(this), style: {"width": "2rem", "position": "absolute", "right": "2%","top":"3%",border:'1px solid #CCDBE8'}})
                    ), 
                    React.createElement("div", {className: "scroll sign-detail", style: {background:'#0095d8'}}, 
                        React.createElement("div", {className: "scroll"}, 
                            /* <h5 style={{color:'#245b8a'}}>《流量签约包业务客户服务协议》</h5>*/
                            React.createElement("ul", {className: "rule-style history-role-style"}, 
                                /* <ol>
                                 本人在此不可撤销地授权上海浦东发展银行股份有限公司信用卡中心（以下简称“卡中心”）于流量签约包生效期内的每月2日向签约信用卡账户发起自动扣除积分操作。授权期限自本人开通流量签约包功能之日起生效，至该订单签约期满之日止。
                                 </ol>
                                 <ol>本人清楚并知悉流量签约包如下相关条款与细则：

                                 </ol>*/
                                React.createElement("ol", null, "1．参与对象：关注并绑定浦发银行信用卡官方微信的浦发银行信用卡主卡持卡人（下称“持卡人”）。"
                                ), 
                                React.createElement("ol", null, "2．参与渠道及路径："

                                ), 
                                "1）浦发银行信用卡官方微信：关注并绑定浦发银行信用卡官方微信，选择“微广场”---“浦发爱红包，流量里程开不停”，" + ' ' +
                                "进入小浦流量“银行”活动页面，点击“提取流量”，选择“流量签约包”。", 
                                React.createElement("br", null), 
                                "2）浦大喜奔APP：下载并绑定浦发银行信用卡浦大喜奔APP，" + ' ' +
                                "点击“流量银行”进入活动页面，点击“提取流量”，选择“流量签约包”。", 
                                React.createElement("ol", null, "3．流量签约包服务的内容："
                                ), 
                                "2017年6月14日至2018年6月30日，持卡人可在小浦流量“银行”内使用“流量签约包”服务，小浦流量“银行”将根据持卡人的签约信息，每月2日起自动下发流量包并从签约信用卡账户中扣除相应的浦发银行信用卡积分（以下简称“积分”）。该服务签约周期支持三个自然月，签约时持卡人可自主输入手机号（可不同于流量圈绑定的号码）和选择流量包规格。关于流量包的下发，小浦流量“银行”将从持卡人成功签约的次月起，于每月2日向运营商发起流量包充值，期间视运营商对流量包的下发规定，流量包将于5个工作日内充入持卡人所签约的手机号码内。", 
                                React.createElement("ol", null, 
                                    "4．流量签约包服务的签约条件："
                                ), 
                                "1)持卡人在签约过程中，根据持卡人当前使用的渠道（微信/APP），小浦流量“银行”系统将以持卡人当前“浦发银行信用卡”官方微信绑定的默认卡或浦大喜奔APP绑定的默认浦发信用卡（简称 “默认卡”）为签约信用卡。签约过程中，系统将会验证当前签约信用卡的账户积分是否充足（以签约页面显示的积分数值为准）。如账户积分充足，方可成功下单签约。如账户积分不足，将无法完成签约。如签约时持卡人的默认卡为附属卡或持卡人浦发信用卡账户下仅有一张特殊卡种信用卡（包括但不限于航空酒店类联名信用卡、五星电器•浦发银行联名信用卡、优悦会•浦发联名信用卡以及麦兜主题信用卡等），则无法使用流量签约包服务。", 
                                React.createElement("br", null), 

                                "2)持卡人需阅读并接受《流量签约包业务客户服务协议》且完成勾选后方可完成签约。", 
                                React.createElement("br", null), 
                                "3)具体签约流程以页面提示为准。", 
                                React.createElement("br", null), 
                                "4)关于本服务积分使用规则以《上海浦东发展银行信用卡积分活动规则》为准。", 
                                React.createElement("ol", null, 
                                    "5．流量签约包服务的生效及使用："
                                ), 
                                    "1)流量签约包服务将于持卡人成功签约的次月起生效。在服务生效期内，小浦流量“银行”将于每月2日自动向签约的信用卡账户发起积分扣除操作，每月仅扣除当月流量包所需积分。如在服务生效期内，当系统向签约信用卡账户发起积分扣减时存在账户积分不足的情况，则积分扣除失败，该月流量包不予下发。", 
                                    React.createElement("br", null), 
                                    "2)持卡人签约成功后，持卡人需确保签约服务生效期内持续绑定“浦发银行信用卡”官方微信或绑定浦大喜奔APP，不可中途解绑或注销。如服务生效期内，持卡人解绑“浦发银行信用卡”官方微信或注销浦大喜奔APP实名账户，则该月流量包不予下发。", 
                                    React.createElement("br", null), 
                                    "3)持卡人可于流量签约包页面内，通过查询“签约记录”获取当前有效服务期内流量包实际下发状态及相关信息。", 
                                    React.createElement("br", null), 
                                    "4)如出现流量包下发状态为失败的情况，浦发银行信用卡中心将于产生下发失败状态后的1个工作日内退还积分至持卡人扣款账户内。", 
                                    React.createElement("br", null), 
                                    "5)持卡人同期只能签约一次服务，不可重复签约。当该期签约服务完成末月流量包下发后，方可进行新一期的服务签约。", 
                                    React.createElement("br", null), 
                                    "6)流量签约包服务一旦成功签约，不可解约。", 
                                React.createElement("ol", null, 
                                    "6．本服务无法提供发票，敬请谅解。"
                                ), 
                                React.createElement("ol", null, 
                                    "7．流量签约包服务仍须遵守《小浦流量“银行”使用规则》。"
                                ), 
                                React.createElement("ol", null, 
                                    "8．持卡人使用流量签约包服务即视为同意遵守《流量签约包功能》使用规则。"
                                )

                            )
                        )
                        /* <div style={{textAlign:'center'}}>
                         <button type="button" style={{width:'40%'}} className="btn btn-primary btn-small sign-card" onClick={this.cancelAgreementServe.bind(this)}>返回</button>
                         </div>*/
                    )
                )
            )
        );
        return (
            React.createElement("div", null, 
                React.createElement(Header, {title: "我的签约包", showCardSignRoles: "normal", showRule: "none", showCardAlert: this.openAgreementServe}), 
                cardHistory
            )
        );
    }
});
var SignCardDetailBox = React.createClass({displayName: "SignCardDetailBox",
    //mixins:[
    //    Reflux.conent(pointStore,'data')
    //],
    componentDidUpdate:function(){
        if(this.props.data.queryDetailSuccess == true){
            //window.location.href = "#/signFlowBagHistory/SignCardDetail";
            //this.refs.loadingSignHistory.close();
        }else if(this.props.data.queryDetailFail == true){
            //this.refs.loadingSignHistory.close();
            this.refs.searchFail.open();
        }
    },
    getInitialState:function(){
        return({
            //pointActions:this.props.actionsPoint
        })
    },
    componentWillMount:function(){

    },
    componentDidMount:function(){
        //pointActions.getOrderListDetail();
        //this.refs.loadingSignHistory.open();
        pointActions.getOrderListDetail(this.props.params.id);
        //点击订单详情时触发的埋点
        _ncp.push(['trackEvent', 'WX', 'Click','default','qyllb_ddxq_open']);
    },
    cancelSearchFail:function(){
        this.refs.searchFail.close();
        window.location.hash='#/index';
    },
    openAgreementServe:function(){
        this.refs.agreementServe.open();
        //点击签约规则时触发的埋点
        _ncp.push(['trackEvent', 'WX', 'Click','default','qyllb_qygz_open']);
    },
    cancelAgreementServe:function(){
        this.refs.agreementServe.close();
    },
    render:function(){
        var listDetail;
        if(this.props.data.orderListDetail.signOrderDetail.length > 0){
            listDetail =  React.createElement("div", {className: "car-sign-content"}, 
                React.createElement("div", null, 
                    React.createElement("ul", {class: "col-xs-12", style: {background:'white',position: 'inherit',
                            padding: '22px',
                            borderRadius:'6px'}}, 
                        React.createElement("li", null, "手机号：", this.props.data.orderListDetail.signOrderDetail[0].MobileNumber), 
                        React.createElement("li", null, "月数：", this.props.data.orderListDetail.signOrderDetail[0].Month, "个自然月"), 
                        React.createElement("li", null, "规格：", this.props.data.orderListDetail.signOrderDetail[0].Package, "M"), 
                        /*<li>备注：{this.props.data.orderListDetail.signOrderDetail[0].Description}</li>*/
                        React.createElement("li", null, "所需总积分：", this.props.data.orderListDetail.signOrderDetail[0].DataPoint, "分"), 
                        React.createElement("li", null, "签约号：", this.props.data.orderListDetail.signOrderDetail[0].SignId)
                    )
                )
            );
        }
        var signCardDetail = $.map(this.props.data.orderListDetail.sendRecordDetail,function(detail,index){
            //var status = detail.State == '4' ? '成功':(detail.State == '3' ? '失败（已退积分）': '未生效（积分不足）');
            //var getStatus = function(state){
            //    switch(state){
            //        case '0':
            //            return '进行中';
            //            break;
            //        case '2':
            //            return '未生效'+ '（'+detail.Description + '）';
            //            break;
            //        case '3':
            //            return '失败（已退积分）';
            //            break;
            //        case '4':
            //            return '成功';
            //            break;
            //        default:
            //            return '进行中'
            //    }
            //};
            //var listDate = new Date(parseFloat(detail.Date)).Format('yyyy/MM/dd');
            //var issueHistory = (detail.State.indexOf('成功') > -1 || detail.State.indexOf('失败') > -1) ? 'block' : 'none';
            //var issueHistory = (detail.State != '9' &&  detail.State != '0') ? 'block' : 'none';
            var issueHistory = detail.State != '9' ? 'block' : 'none';
            return (
                React.createElement("li", {className: "list-group-item", style: {display:issueHistory}}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-xs-4"}, detail.Date), 
                    /*<div className="col-xs-8">{getStatus(detail.State)}</div>*/
                        React.createElement("div", {className: "col-xs-8", style: {color:'#1bacf3'}}, detail.ResultMsg)
                    )
                )
            )
        });
        return(
            React.createElement("div", null, 
                React.createElement(Header, {title: "我的签约包", showHistory: "none", showCardSignRoles: "normal", showRule: "none", showCardAlert: this.openAgreementServe}), 
                React.createElement("div", {className: "order-history-title"}, 
                /*<span>订单详情</span>*/
                    React.createElement("div", null, 
                        React.createElement("span", {style: {position:'absolute',color:'#10a5ef',fontWeight:'bold',fontSize:'1.8rem',marginTop:'1%'}}, "签约详情")
                    ), 
                    React.createElement("img", {src: "assets/images/signCard/signCardDetail1.png", style: {width:'43%'}})
                ), 
                listDetail, 
                React.createElement("div", {className: "order-history"}, 
                    React.createElement("ul", {className: "list-group"}, 
                        React.createElement("li", {className: "list-group-item", style: {background:'#10a5ef',border:'none'}}, 
                            React.createElement("div", {className: "row"}, 
                                React.createElement("div", {className: "col-xs-4", style: {color:'white'}}), 
                                React.createElement("div", {className: "col-xs-6", style: {color:'white'}}, "下发记录"), 
                                React.createElement("div", {className: "col-xs-2"})
                            )
                        ), 
                  signCardDetail
                  /*
                   <li className="list-group-item">
                   <div className="row">
                   <div className="col-xs-4">2017/12/24</div>
                   <div className="col-xs-8">未生效（积分不足）</div>
                   </div>
                   </li>
                   <li className="list-group-item">
                   <div className="row">
                   <div className="col-xs-4">2017/12/24</div>
                   <div className="col-xs-8">未生效（积分不足）</div>
                   </div>
                   </li>
                   */
                    )
                ), 
                /*
                 <BootstrapModal ref="loadingSignHistory" title="提示" onCancel={this.cancelLoadingSignHistory}>
                 <div style={{position:'relative'}}>
                 <div>
                 <img src='assets/images/base/FC1.png' style={{"width":'100%'}}/>
                 </div>
                 <div className="modal-body-content" style={{top: '47%', padding: '0 10%'}}>


                 <span style={{fontSize:'1.5rem'}}>小浦正在查询请您稍后！</span> <br/>
                 <span style={{fontSize:'1.4rem'}}>  </span> <br/>
                 <span style={{fontSize:'1rem'}}></span> <br/>

                 </div>
                 </div>
                 </BootstrapModal>
                */
                React.createElement(BootstrapModal, {ref: "searchFail", title: "提示", onCancel: this.cancelSearchFail}, 
                    React.createElement("div", {style: {position:'relative'}}, 
                        React.createElement("div", null, 
                            React.createElement("img", {src: "assets/images/base/FC1.png", style: {"width":'100%'}})
                        ), 
                        React.createElement("div", {className: "modal-body-content", style: {top: '30%', padding: '0 10%'}}, 


                            React.createElement("span", {style: {fontSize:'1.5rem'}}, "查询失败请您稍后重试"), " ", React.createElement("br", null), 
                            React.createElement("span", {style: {fontSize:'1.4rem'}}, "  "), " ", React.createElement("br", null), 
                            React.createElement("span", {style: {fontSize:'1rem'}}), " ", React.createElement("br", null), 

                            React.createElement("div", {className: "center-button"}, 
                             React.createElement("a", {href: "javascript:;", onClick: this.cancelSearchFail}, 
                             React.createElement("img", {src: "assets/images/base/bt1.png", style: {"width":'60%'}})
                             )
                             )
                        )
                    )
                ), 
                React.createElement(BootstrapModal, {ref: "agreementServe", title: "提示", onCancel: this.cancelAgreementServe}, 
                    React.createElement("div", {className: "container", style: {background:'#0095d8'}}, 
                        React.createElement("div", {className: "car-sign-title", style: {border: 'none',
                            padding: '10px',background:'#028ac1',height:'4rem', margin:
                        'auto -15px'}}, 
                            React.createElement("h5", {style: {    letterSpacing: '0px', lineHeight: '1rem',
                                marginRight: '25px',whiteSpace:'nowrap'}}, "流量签约包功能使用规则")
                        ), 
                        React.createElement("div", null, 
                            React.createElement("img", {src: "assets/images/base/icon_x.png", onClick: this.cancelAgreementServe.bind(this), style: {"width": "2rem", "position": "absolute", "right": "2%","top":"3%",border:'1px solid #CCDBE8'}})
                        ), 
                        React.createElement("div", {className: "scroll sign-detail", style: {background:'#0095d8'}}, 
                            React.createElement("div", {className: "scroll"}, 
                                /* <h5 style={{color:'#245b8a'}}>《流量签约包业务客户服务协议》</h5>*/
                                React.createElement("ul", {className: "rule-style history-role-style"}, 
                                    /* <ol>
                                     本人在此不可撤销地授权上海浦东发展银行股份有限公司信用卡中心（以下简称“卡中心”）于流量签约包生效期内的每月2日向签约信用卡账户发起自动扣除积分操作。授权期限自本人开通流量签约包功能之日起生效，至该订单签约期满之日止。
                                     </ol>
                                     <ol>本人清楚并知悉流量签约包如下相关条款与细则：

                                     </ol>*/
                                    React.createElement("ol", null, "1．参与对象：关注并绑定浦发银行信用卡官方微信的浦发银行信用卡主卡持卡人（下称“持卡人”）。"
                                    ), 
                                    React.createElement("ol", null, "2．参与渠道及路径："

                                    ), 
                                    "1）浦发银行信用卡官方微信：关注并绑定浦发银行信用卡官方微信，选择“微广场”---“浦发爱红包，流量里程开不停”，" + ' ' +
                                    "进入小浦流量“银行”活动页面，点击“提取流量”，选择“流量签约包”。", 
                                    React.createElement("br", null), 
                                    "2）浦大喜奔APP：下载并绑定浦发银行信用卡浦大喜奔APP，" + ' ' +
                                    "点击“流量银行”进入活动页面，点击“提取流量”，选择“流量签约包”。", 
                                    React.createElement("ol", null, "3．流量签约包服务的内容："
                                    ), 
                                    "2017年6月14日至2018年6月30日，持卡人可在小浦流量“银行”内使用“流量签约包”服务，小浦流量“银行”将根据持卡人的签约信息，每月2日起自动下发流量包并从签约信用卡账户中扣除相应的浦发银行信用卡积分（以下简称“积分”）。该服务签约周期支持三个自然月，签约时持卡人可自主输入手机号（可不同于流量圈绑定的号码）和选择流量包规格。关于流量包的下发，小浦流量“银行”将从持卡人成功签约的次月起，于每月2日向运营商发起流量包充值，期间视运营商对流量包的下发规定，流量包将于5个工作日内充入持卡人所签约的手机号码内。", 
                                    React.createElement("ol", null, 
                                        "4．流量签约包服务的签约条件："
                                    ), 
                                    "1)持卡人在签约过程中，根据持卡人当前使用的渠道（微信/APP），小浦流量“银行”系统将以持卡人当前“浦发银行信用卡”官方微信绑定的默认卡或浦大喜奔APP绑定的默认浦发信用卡（简称 “默认卡”）为签约信用卡。签约过程中，系统将会验证当前签约信用卡的账户积分是否充足（以签约页面显示的积分数值为准）。如账户积分充足，方可成功下单签约。如账户积分不足，将无法完成签约。如签约时持卡人的默认卡为附属卡或持卡人浦发信用卡账户下仅有一张特殊卡种信用卡（包括但不限于航空酒店类联名信用卡、五星电器•浦发银行联名信用卡、优悦会•浦发联名信用卡以及麦兜主题信用卡等），则无法使用流量签约包服务。", 
                                    React.createElement("br", null), 

                                    "2)持卡人需阅读并接受《流量签约包业务客户服务协议》且完成勾选后方可完成签约。", 
                                    React.createElement("br", null), 
                                    "3)具体签约流程以页面提示为准。", 
                                    React.createElement("br", null), 
                                    "4)关于本服务积分使用规则以《上海浦东发展银行信用卡积分活动规则》为准。", 
                                    React.createElement("ol", null, 
                                        "5．流量签约包服务的生效及使用："
                                    ), 
                                        "1)流量签约包服务将于持卡人成功签约的次月起生效。在服务生效期内，小浦流量“银行”将于每月2日自动向签约的信用卡账户发起积分扣除操作，每月仅扣除当月流量包所需积分。如在服务生效期内，当系统向签约信用卡账户发起积分扣减时存在账户积分不足的情况，则积分扣除失败，该月流量包不予下发。", 
                                        React.createElement("br", null), 
                                        "2)持卡人签约成功后，持卡人需确保签约服务生效期内持续绑定“浦发银行信用卡”官方微信或绑定浦大喜奔APP，不可中途解绑或注销。如服务生效期内，持卡人解绑“浦发银行信用卡”官方微信或注销浦大喜奔APP实名账户，则该月流量包不予下发。", 
                                        React.createElement("br", null), 
                                        "3)持卡人可于流量签约包页面内，通过查询“签约记录”获取当前有效服务期内流量包实际下发状态及相关信息。", 
                                        React.createElement("br", null), 
                                        "4)如出现流量包下发状态为失败的情况，浦发银行信用卡中心将于产生下发失败状态后的1个工作日内退还积分至持卡人扣款账户内。", 
                                        React.createElement("br", null), 
                                        "5)持卡人同期只能签约一次服务，不可重复签约。当该期签约服务完成末月流量包下发后，方可进行新一期的服务签约。", 
                                        React.createElement("br", null), 
                                        "6)流量签约包服务一旦成功签约，不可解约。", 
                                    React.createElement("ol", null, 
                                        "6．本服务无法提供发票，敬请谅解。"
                                    ), 
                                    React.createElement("ol", null, 
                                        "7．流量签约包服务仍须遵守《小浦流量“银行”使用规则》。"
                                    ), 
                                    React.createElement("ol", null, 
                                        "8．持卡人使用流量签约包服务即视为同意遵守《流量签约包功能》使用规则。"
                                    )

                                )
                            )
                            /* <div style={{textAlign:'center'}}>
                             <button type="button" style={{width:'40%'}} className="btn btn-primary btn-small sign-card" onClick={this.cancelAgreementServe.bind(this)}>返回</button>
                             </div>*/
                        )
                    )
                )
            )
        )
    }
});