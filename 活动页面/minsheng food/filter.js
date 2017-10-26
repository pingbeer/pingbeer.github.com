angular.module('activityday.filters', [])
.filter('toJSON',function(){
	return function(obj){
		if(angular.isString(obj)){
			return angular.fromJson(obj);
		}else{
			return obj;
		}
	}
})
.filter('effectDate',function(){
	return function(str){
		if(isEmpty(str)){
			return "有效期至:长期有效";
		}else{
			var strDate=str.split(" ")[0];
			var array=strDate.split("-");
			str="有效期至:"+array[0]+"年"+array[1]+"月"+array[2]+"日";
			return str;
		}
	}
})
.filter('myPrivDate',function(){
	return function(str){
		if(!isEmpty(str)){
			str=str.substr(0,10);
			return str;
		}
	}
})
.filter('lifeSpan',function(){
	return function(str){
		if(!isEmpty(str)){
			var spanJson;
			if(angular.isString(str)){
				spanJson=angular.fromJson(str);
	    	}else{
	    		spanJson=str;
	    	}
	 		var validType=spanJson.validType;
	 		var endDate=spanJson.endDate;
		 	if(validType=="01" && !isEmpty(spanJson.vMonth)){
		 		str="有效期:兑换成功日起"+spanJson.vMonth+"个月内有效";	
		 	}else if(validType=="02" && !isEmpty(spanJson.vDay)){
		 		str="有效期:兑换成功日起"+spanJson.vDay+"天内有效";	 	
		 	}else if(validType=="03" && !isEmpty(endDate)){
		 		str="有效期:"+endDate.substr(0,4)+"年"+endDate.substr(5,2)+"月"+endDate.substr(8,2)+"日";
		 	}else if(validType=="04"){
		 		str="有效期:长期有效";
		 	}
	 	}
		return str;
	}
})
.filter('prodlistDate',function(){
	return function(str){
		if(isEmpty(str)){
			return "特权有效期:长期有效";
		}else{
			str="特权有效期:"+str.substr(0,4)+"年"+str.substr(4,2)+"月"+str.substr(6,2)+"日";
			return str;
		}
	}
})
.filter('publicDate',function(){
	return function(str){
		if(isEmpty(str)){
			return "有效期:长期有效";
		}else{
			var strDate=str.split(" ")[0];
			var array=strDate.split("-");
			str="有效期:"+array[0]+"年"+array[1]+"月"+array[2]+"日";
			return str;
		}
	}
})
.filter('transPrice',function(){
	return function(price,param1){
		var obj,output="";
		if(angular.isString(price)){
			obj=angular.fromJson(price);
    	}else{
    		obj=price;
    	}
		for(var key in obj){
			output=output+" + "+obj[key]["amt"]+obj[key]["unitDesc"];
    	}
    	if(!isEmpty(output)){
    		output=output.substring(3);
    		if(!isEmpty(param1)){
    			output=output+param1;
    		}
    	}else{
    		output=null;
    	}
		return output;
	}
});