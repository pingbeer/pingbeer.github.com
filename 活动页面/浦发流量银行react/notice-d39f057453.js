/**
 * Created by Administrator on 2016/8/25 0025.
 */


var NoticeBox = React.createClass({displayName: "NoticeBox",
    // mixins: [
    //     Reflux.connect(BlessRoomStore,"data"),
    //     // React.addons.LinkedStateMixin
    // ],
    getInitialState: function () {
        return ({
            wantBag:"",
            curIndex: -1,
            payType:0
        })
    },
    componentDidMount: function () {
    },
   
    render: function () {
        return(
            React.createElement("div", {style: {marginTop: '1rem',width:'100%'}}, 

                React.createElement(Header, {title: "我的流量“银行”", showRule: "none"}), 


               /*<p style={{fontSize:"1.5rem",textAlign:"center",marginTop:"50%"}}>由于当前访问人数过多，请稍后进入流量银行</p>*/

                React.createElement("img", {src: "assets/images/bill/more.png", alt: "", style: {width:"100%",marginTop:'10rem'}})


        )
        )
    }
})