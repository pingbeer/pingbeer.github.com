<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>项目合同列表</title>

    <meta name="renderer" content="webkit">
    <link rel="stylesheet" type="text/css" href="/resources/easyui/base_new_vue.css?v=ca049c7ec2">
    <link rel="stylesheet" type="text/css" href="/resources/easyui/index.css">

    <script src="/resources/easyui/vue.min.js"></script>
    <script src="/resources/easyui/element-ui.js"></script>
    <script src="/resources/easyui/axios.min.js"></script>
    <script src="/resources/easyui/pace.min_vue.js?v=fe5e2eaca6"></script>
    <script src="/resources/easyui/order-util_vue.js"></script>
    <script src="/resources/easyui/accounting.min.vue.js"></script>
    <style>


        /*滚动条轨道背景(默认在PC端设置)*/
        ::-webkit-scrollbar-track{
            background-color: transparent;
        }
        /*滚动条轨道宽度 (默认在PC端设置)*/
        ::-webkit-scrollbar{
            width: 8px;
            height: 8px;
        }
        /*滚动条游标 (默认在PC端设置)*/
        ::-webkit-scrollbar-thumb{
            border-radius: 8px;
            background-color: #ccc;
        }
        /*滚动条游标鼠标经过的颜色变化 (默认在PC端设置)*/
        ::-webkit-scrollbar-thumb:active, ::-webkit-scrollbar-thumb:hover{
            background-color: #aaa;
        }

        .el-header, .el-footer {
            color: #333;
            text-align: center;
            /*line-height: 60px;*/
        }
        .el-header{
            height: 100px;
        }
        .el-footer{
            position: fixed;
            height: 60px;
            bottom: 0;
            width: 100%;
        }
        .el-container{
            height:100%;
        }
        .mainPage{
            height: -webkit-calc(100%  -  60px);
            /*height: 300px;*/
            overflow: auto;
        }
        .vuePage{
            height: 35px;
            padding-top: 10px;
            line-height: 80px;
            vertical-align: bottom;
            background: #f5f5f5;
            border-top: 2px solid #2e8ae6;
            text-align: right;
            position: relative;
        }
        #app{
            padding:8px 8px 0 8px;
            margin-bottom:0;
        }
        .el-main{
            max-height: calc(100%  -  60px);
            width:100%;
            /*height: calc(100% - 60px);*/
            /*flex-basis:auto;*/
        }
        .el-table--border::after, .el-table--group::after{
            width:0;
        }

        [v-cloak] {
            display: none;
        }
        .el-form-item{
            margin-bottom: 12px;
        }
        .el-table__empty-block{
            height: 60px;
        }
        .el-message .el-icon-warning,  .el-message--warning .el-message__content{
            color:#fff;
        }
        .el-pagination button.disabled, .el-pagination .btn-next, .el-pagination .btn-prev, .el-pager li,.el-pagination button{
            background: transparent;
        }
        .el-table__fixed-right::before, .el-table__fixed::before,   .el-table::before{
            height: 0;
        }
        .el-table__header tr, .el-table__footer-wrapper, .el-table__header-wrapper,.el-table thead{
            background:#eff1f9 ;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,.el-table__body tr.current-row>td,.el-table__body tr.hover-row.current-row>td,.el-table__body tr.hover-row.el-table__row--striped.current-row>td,.el-table__body tr.hover-row.el-table__row--striped>td,.el-table__body tr.hover-row>td{background-color:transparent}
        body{
            margin-bottom:0;
        }
    </style>

    <style>
        .namebdsml{
            color: #b3b3b3;
        }
        .clr1{
            color:#ff9900;
        }
        .clr2{
            color:#33cc00;
        }
        .selOption{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            /*width: 40px;*/
            width: 160px;
            display: block;
        }
        .selOptionBz{
            font-style: normal;
            font-size: 10px !important;
            background: #36d1af;
            color: #fff;
            border-radius: 3px;
            -webkit-transform: scale(0.8);
            transform: scale(0.8);
            margin-left: 10px;
            position: absolute;
            height: 20px;
            right: 3px;
            top: 8px;
            line-height: 20px;
        }
        .tips_contants{position:fixed;top:50%;left:50%;z-index:99999;margin-top:-150px;margin-left:-150px;width:300px;height:80px;border-radius:5px;background:rgba(0,0,0,.8);color:#fff;text-align:center;line-height:80px}

    </style>
</head>
<body style="background: #fff;height: 100%">

<div id="app" v-cloak>
    <div id="datagrid-mask-msg" class="frame_box datagrid-mask-msg" style="display:block;left:50%"><span></span></div>
    <%--<el-tabs v-model="activeName" @tab-click="handleClick">--%>
    <%--<el-tab-pane label="全部业务明细" name="first">全部业务明细</el-tab-pane>--%>
    <%--<el-tab-pane label="待安装明细" name="second">待安装明细</el-tab-pane>--%>
    <%--</el-tabs>--%>


    <%--<el-container>--%>
        <%--<el-header>--%>
            <%--<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">--%>
                <%--<el-menu-item index="1">全部业务明细</el-menu-item>--%>
                <%--<el-menu-item index="3">待安装明细</el-menu-item>--%>
            <%--</el-menu>--%>
        <%--</el-header>--%>
        <%--<el-main>--%>

            <%--<el-table--%>
                    <%--:data="tableData3"--%>
                    <%--style="width: 100%"--%>
                    <%--height="100%">--%>
                <%--<el-table-column--%>
                        <%--fixed--%>
                        <%--prop="date"--%>
                        <%--label="日期"--%>
                        <%--width="150">--%>
                <%--</el-table-column>--%>
                <%--<el-table-column--%>
                        <%--prop="name"--%>
                        <%--label="姓名"--%>
                        <%--width="120">--%>
                <%--</el-table-column>--%>
                <%--<el-table-column--%>
                        <%--prop="province"--%>
                        <%--label="省份"--%>
                        <%--width="120">--%>
                <%--</el-table-column>--%>
                <%--<el-table-column--%>
                        <%--prop="city"--%>
                        <%--label="市区"--%>
                        <%--width="120">--%>
                <%--</el-table-column>--%>
                <%--<el-table-column--%>
                        <%--prop="address"--%>
                        <%--label="地址"--%>
                        <%--width="300">--%>
                <%--</el-table-column>--%>
                <%--<el-table-column--%>
                        <%--prop="zip"--%>
                        <%--label="邮编"--%>
                      <%-->--%>
                <%--</el-table-column>--%>
            <%--</el-table>--%>

        <%--</el-main>--%>
        <%--&lt;%&ndash;<el-footer>Footer</el-footer>&ndash;%&gt;--%>
    <%--</el-container>--%>

<section class="secCon " >
        <el-menu :default-active="activeIndex"  mode="horizontal" @select="handleSelect">
            <el-menu-item index="01">全部业务明细</el-menu-item>
            <el-menu-item index="">待安装明细</el-menu-item>
        </el-menu>
    <div style="margin-top:10px;">
    <el-form :inline="true" :model="formInline" size="small" class="">

        <el-form-item >
            <el-select  clearable   filterable v-model="formInline.partnerKey" id="customerDat" placeholder="选择客户">
                <el-option
                    v-for="item in options"
                    :key="item.partnerKey"
                    :label="item.partnerShortname"
                    :value="item.partnerKey">
                    <span style="float: left" class="selOption">{{ item.partnerShortname }}</span>
                    <i class="selOptionBz" style="float: right;">{{ item.partnerStatus | friendFun }}</i>
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item >
            <el-select  style="width: 130px" v-model="formInline.changeDt" @change="onChangeDat" placeholder="选择日期" id="dateDat">
                <el-option
                        v-for="item in optionsDat"
                        :key="item.key"
                        :label="item.show"
                        :value="item.key">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item >

            <el-date-picker
                    v-model="formInline.startTime"
                    type="date" size="small" style="width: 150px"
                    :editable="true"
                    placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item >
            <el-date-picker
                    v-model="formInline.endTime"
                    type="date" size="small" style="width: 150px"
                    :editable="true"
                    placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item >
            <el-input  v-model="formInline.searchKey"  prefix-icon="el-icon-search"
                       @keyup.enter.native="enterSearch" style="width: 200px"
                       placeholder="输入单号、项目名称、业务内容" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  type="primary" @click="onSubmit" >搜索</el-button>
            <el-button  type="primary" @click="createOrder" v-show="ctorder"
                       >创建工单</el-button>
            <el-button  type="primary" @click="needInstaller" v-show="insorder"
                       >需要安装</el-button>

        </el-form-item>
        <%--<el-form-item style="float: right;">--%>
            <%--<el-button  type="primary" @click="onSubmit"--%>
            <%-->创建工单</el-button>--%>
            <%--<el-button  type="primary" @click="onSubmit"--%>
            <%-->需要安装</el-button>--%>

        <%--</el-form-item>--%>
    </el-form>
        <%--<div class="row" style="margin:0;">--%>
   <%----%>
            <%----%>
            <%--<div  style="     color: #ff9900;--%>
    <%--float: right;--%>
    <%--margin-right: 20px;" id="caozuoTip" data-toggle="popover" data-container="body" data-trigger="hover" data-placement="bottom"--%>
                  <%--data-html="true" data-content="将需要一起安装的业务明细批量勾选，创建为一笔安装工单" data-original-title="" title="">--%>
                <%--注意事项<span class="iconfont_new"--%>
                          <%--style="position: relative;top:-1px;vertical-align: middle;font-size: 20px"></span></div>--%>
        <%--</div>--%>
        <%----%>
    </div>
        <div style="width:100%;" class="mainPage">
        <el-table ref="table1" border size="small"
                :height="heightV"
                  <%--v-loading="loading"--%>
                  <%--element-loading-text="拼命加载中..."--%>
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange"
                <%--:data="tableData3.slice((page-1)*rows,page*rows)"--%>
                :data="tableData3"
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="35">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="orderDate"
                    label="散单概要"
                    width="140">
                <template slot-scope="scope">
                    <span @click="handleEdit(scope.$index, scope.row)" data-id={{scope.row.salesNo}}  href='##'>{{scope.row.orderDate}}</span><div class="namebd"><span class="namebdsml" >{{scope.row.caseDesc | caseFun('无概要')}}</span></div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="statusDesc"
                    label="安装状态"
                    width="100">
                <template slot-scope="scope">
                   <span :class="[scope.row.status=='0'? 'namebdsml clr1' : 'namebdsml clr2']"  >{{scope.row.statusDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="partnerShortname"
                    label="客户"
                    width="100">
                <template slot-scope="scope">
                    <div>{{scope.row.partnerShortname}}</div><div class="namebdsml">{{scope.row.contactName }}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="businessDesc"
                    label="业务内容"
                    show-overflow-tooltip
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="requirements"
                    label="物料/制作/说明"

                    width="200">
            </el-table-column>
            <el-table-column
                    prop="specification"
                    width="200"
                    label="规格(m)"
            >   </el-table-column>
                <el-table-column
                        prop="quantity"
                        width="60"
                        label="数量"
                >
            </el-table-column>
                <el-table-column
                        prop="totalArea"
                        width="90"
                        label="面积(㎡)"
                >   </el-table-column>
            <el-table-column
                    prop="unit"
                    width="60"
                    label="单位"
            >   </el-table-column>
            <el-table-column
                    prop="unitPrice"
                    width="90"
                    align="right"
                    :formatter="MoneyFormat"
                    label="单价(元)"
            >   </el-table-column>
            <el-table-column
                    prop="totalPrice"      align="right"
                    width="90"  :formatter="MoneyFormat"
                    label="行小计(元)"
            >   </el-table-column>
            <el-table-column
                    prop="totalPriceOrder"      align="right"
                    width="100"  :formatter="MoneyFormat"
                    label="订单金额"
            >   </el-table-column>
            <el-table-column
                    prop="salesNo"
                    width="160"
                    label="销售单号"
            >   </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="制单时间"
                    width="160"
            >   </el-table-column>

        </el-table>
        </div>
        <div class="vuePage">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="formInline.page"
                :page-sizes="[5, 50, 100]"
                :page-size="formInline.rows"
                layout="prev, pager, next"
                :total="total">
        </el-pagination>
        </div>
</section>
</div>
<script>
//    Vue.filter('caseFun', function (value, str) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
//        console.log(value);
//        if(!value || value=="" || value==null){
//            return str;
//        }else{
//            return value;
//        }
//
//    });

    var app=  new Vue({
        el: '#app',
        data: function() {
            return {
                formInline: {
                    partnerKey: 'ALL',
                    searchKey: '',
                    startTime: '',
                    changeDt: '',
                    endTime: '',
                    orderStatus: '01',
                    page:1,
                    rows:30
                },
                options:[],
                loading:true,
                ctorder:false,
                insorder:true,
                optionsDat:orderUtil.dateConfig,
                activeName: 'second',
                activeIndex: '01',
                noHeight:"183",
                heightV:'1000',
                postUrl:"/order/installation/listSalesOrderAndDetail",
                total:1,
                selVal:[],
                tableData3: []
            }
        },
        filters: {
            friendFun:function (value,str) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
                if(value=="1"){
                    return "好友";
                }
                return "";

            }
        },
        mounted() {
            var that=this;
            window.onresize = function temp() {
                that.heightV = parseInt(window.innerHeight-that.noHeight);
            };

            that.customerList();


        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleSelectionChange(val) {
              this.selVal=val;
              console.log(this.selVal);
            },
            MoneyFormat(row, column) {

                var mon = row[column.property];
                if (mon == undefined ||mon=="") {
                    return "0.00";
                }
                return accounting.formatNumber(mon,2)
            },
            customerList:function () {
                var that=this;
                var pageCustomerUrl =  "/system/partner/dropdownPartner?partnerType=1";
                axios.get(pageCustomerUrl).then(function(d){
//                    var json=d.data.rows;
                    console.log(d);
                    that.options=d.data;
                    that.initPage();
                })
            },
            onSubmit() {
                this.tbLoad();
            },
            needInstaller() {
                var that=this;
                let arr = [];
                var checkRow = "";
                for (let i in that.selVal) {
                    arr.push(that.selVal[i].uid);
                }
                if(that.selVal.length>0){
                    axios.post("/order/installation/insertInstallStandingBy?detailUid="+arr).then(function (data) {
                        that.activeIndex="";
                        that.handleSelect();
                    });
                }else {
                    that.$message({
                        showClose: true,
                        duration:2000,
                        customClass:"tips_contants",
                        message: '请选择安装单',
                        type: 'warning'
                    });
                }

            },
            createOrder() {
                var that=this;
                let arr = [];
                var checkRow = "";
                for (let i in that.selVal) {
                    arr.push(that.selVal[i].uid);
                }
                if(that.selVal.length>0) {
                    var App = window.parent.App;
                    var config = {
                        path: "/order/installation/forward-addInstallationOrder?detailUid="+arr,
                    };
                    App.open(config.path, config);
                }else {
                    that.$message({
                        showClose: true,
                        duration:2000,  customClass:"tips_contants",
                        message: '请选择安装单',
                        type: 'warning'
                    });
                }
            },
            onChangeDat(cur) {
                var that=this;
                console.log('onChangeDat!');
                console.log(cur);
                var code =cur.substring(0, 2);
                var num = cur.substring(2, cur.length);
                var dt = orderUtil.dpDateCompute(code, num);
               that.formInline.startTime=dt.beforeDate;
               that.formInline.endTime=dt.nowDate;
            },
            handleSizeChange: function (size) {
                this.formInline.rows = size;
            },
            handleCurrentChange: function(currentPage){
                this.formInline.page = currentPage;
                this.tbLoad();
            },
            enterSearch: function(){
                this.tbLoad();
            },
            handleSelect(key) {
                var that=this;
                if(key=="01"){
                 that.formInline.orderStatus="01";
                 that.ctorder=false;
                 that.insorder=true;
                 that.postUrl="/order/installation/listSalesOrderAndDetail";
                }else{
                    that.ctorder=true;
                    that.insorder=false;
                    that.postUrl="/order/installation/listInstallStandingBy";
                    delete that.formInline.orderStatus;
                }
                that.tbLoad();
            },
            initPage(){
                var that=this;
                that.tbLoad();

                that.heightV=parseInt(window.innerHeight-that.noHeight);
                console.log(parseInt(window.innerHeight));
//                that.$refs.table1.doLayout() ;
            },
            tbLoad(){
                var that=this;
                that.loading=true;
                axios.get(that.postUrl,{
                    params:that.formInline}).then(function(d){
                    var json=d.data.rows;
                    that.tableData3=json;
                    that.total=d.data.total;
                    that.loading=false;
//                    console.log(eval("(" + json +")"));
//                    that.tableData3=eval("(" + json +")");
                }).catch(function(response){
                    that.loading=false;
                })
//          axios.post(pageInstallUrl,
//                    queryParams).then(function(d){
//                    var json=d.data.rows;
//                    that.tableData3=json;
//                    that.total=d.data.total;
////                    console.log(eval("(" + json +")"));
////                    that.tableData3=eval("(" + json +")");
//                },function(response){
//                    console.log(response+";;;;;;;;;");
//                })

            }
        }
    })

</script>
</body>
</html>