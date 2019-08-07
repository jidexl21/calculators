var Calculator = (function(){


var settings = {
	calcMode: 1,
	maxTenor: 12,
	minAmount:50000,
	maxAmount:3000000,
	rate: 0.065
}

var inputs = {
    rate: settings.rate,
    monthly:true,
    principal: 1000000,
    tenor:12
 }

 var Interest = (rate, principal, Tenor)=>{
    var period = (inputs.monthly)? Tenor : Tenor*12;
    return principal*rate*period;
 }

 var getOutput = ()=> {
	return repaymentCalcModes(settings.calcMode);
}

var repaymentCalcModes =(mode) =>{
	var unitpayment = 0 ;
	var totalPayment = 0; 
	var duration = (inputs.monthly)? inputs.tenor : inputs.tenor*12;
	switch(mode){
		case 1: 
			unitpayment = (inputs.principal * inputs.rate)/(1- (Math.pow((1+inputs.rate), -1*duration))); 
			totalPayment = unitpayment*duration; 
		break; 
		case 2: 
			var x = Interest(inputs.rate,inputs.principal, duration); 
			var totalPayment = x + inputs.principal; 
			unitpayment = totalPayment/duration; 
		break; 
	}
	return {unitpayment, totalPayment};
}

var updateInputs =()=>{
        inputs.principal = parseInt($("#principal").val());
        inputs.tenor = parseInt($("#tenor").val());
        $("#loanAmt").html("&#8358;"+inputs.principal.toLocaleString());
        $("#duration").text(inputs.tenor.toLocaleString());
		var trs = $.trim($("#repayment").html().replace(/[\,,(\&\#8358;)]/g,''));
        var x = getOutput();
		var prev = ((trs !== "") && !isNaN(trs)) ?  parseFloat(trs) : 0.00;  
		var options = {
			decimalPlaces: 2,
			duration: 0.5,
			startVal:prev
		};
		var afterChange = function(){
			//$("#repayment").prepend("&#8358;")
		};
		let demo = new CountUp('repayment', x.unitpayment, options);
		if (!demo.error) {
			demo.start(afterChange);
		} else {
			console.error(demo.error);
		}
}




var initCalc = function(){
	
	$("#tenor").attr("max", settings.maxTenor); 
	$("#tenor").attr("min", settings.minTenor); 
	$("#principal").attr("max", settings.maxAmount); 
	$("#principal").attr("min", settings.minAmount); 
	var amtUpdated = function(){
		var prevVal = $("input[name=amount]").val();
        var val = $(this).val();
		$("input[name=amount]").val(val).data("prev",prevVal);
		$("#principal").val(val)
        updateInputs();
    }
    $("#principal").on("change", amtUpdated).keyup(amtUpdated);
    var LoanAmtChanged =  function(e){
        var val = $(this).val();
        var min  =  parseInt($("#principal").attr("min")); 
		var max  =  parseInt($("#principal").attr("max")); 
		
		setTimeout(function(){
			var v = val;
			var toUpdate = false; 
			if(v < min){ $("input[name=amount]").val(min); v = min; toUpdate = true; }
			if(v > max){$("input[name=amount]").val(max); v = max; toUpdate = true; }
			$("input[name=amount]").val(v);
			if(toUpdate) updateInputs();
		}, 1000)
		
        
		$("#principal").val(val);
        updateInputs();
    }
	$("input[name=amount]").on("change", LoanAmtChanged).keyup(LoanAmtChanged);
	var loanTenorChanged = function(){
		var prevVal = $("input[name=duration]").val();
        var val = $(this).val();
        $("input[name=duration]").val(val).data("prev",prevVal); ;
        updateInputs();     
    }
    $("#tenor").on("change", loanTenorChanged).keyup(loanTenorChanged);
	var loanTenorChanged1 =  function(){
        var val = $(this).val();
        var min  =  parseInt($("#tenor").attr("min")); 
        var max  =  parseInt($("#tenor").attr("max")); 
        if(val < min){ $(this).val(min); val = min;}
        if(val > max){$(this).val(max); val = max;}
        $("#tenor").val(val); 
        updateInputs(); 
    }
    $("input[name=duration]").on("change",loanTenorChanged1).keyup(loanTenorChanged1);

};

//Investment Caluclator
var cfg = [
  {"min":250000,max:(10000000-1),rate:[0,0,0,0.20,0.20,0.20,0.22,0.22,0.22,0.22,0.22,0.22,0.24]},
  {"min":10000000,max:(20000000-1),rate:[0,0,0,0.24,0.24,0.24,0.26,0.26,0.26,0.26,0.26,0.26,0.28]},
  {"min":20000000,max:30000000,rate:[0,0,0,0.00,0.00,0.00,0.28,0.28,0.28,0.28,0.28,0.28,0.30]}
]; 

var initInvCalc = function(){
		var invInputs = {
		duration:3,
		amt:250000,
		totalROI:0,
		rate:0.0
	};
 var getROI = function(){
	  var s = cfg.filter(function(x){
		return (x.min<=invInputs.amt) &&(x.max>=invInputs.amt);
	  });
	 
	  var band = (s.length > 1)? 1: 0;
	  invInputs.rate = (s.length >= 1)? s[band].rate[invInputs.duration] : 0.0;
	  var xr =  invInputs.rate * invInputs.amt;	  
	  invInputs.totalROI = xr;
	  return xr; 
	 }


	var updateInvInputs =()=>{
		    var trs = $.trim($("#roi").html().replace(/[\,,(\&\#8358;)]/g,''));
			var prev = ((trs !== "") && !isNaN(trs)) ?  parseFloat(trs) : 0.00; 
			var options = {
				decimalPlaces: 2,
				duration: 0.5,
				startVal:prev
			};
			var trs = $.trim($("#roi").html().replace(/[\,,(\&\#8358;)]/g,''));
			
			var afterChange = function(){};
			let demo = new CountUp('roi', invInputs.totalROI, options);
			if (!demo.error) {
				demo.start(afterChange);
			} else {
				console.error(demo.error);
			}
			$("#investmentAmt").html("&#8358;"+invInputs.amt.toLocaleString());
			$("#mroi").html((invInputs.totalROI/12).toLocaleString());
			$("#iduration").text(invInputs.duration);
	}
	var itenorChanged1 = function(){
		var val = $(this).val();
		invInputs.duration = parseInt(val);
		$("input[name=iduration]").val(val);
		getROI();
		updateInvInputs(); 
	}
    $("#itenor").on("change",itenorChanged1).keyup(itenorChanged1); 
	var iTenorChanged = function(){
        var val = parseInt($(this).val());
        var min  =  parseInt($("#itenor").attr("min")); 
        var max  =  parseInt($("#itenor").attr("max")); 
        if(val < min){ $(this).val(min); val = min;}
        if(val > max){$(this).val(max); val = max;}
		$("#itenor").val(val); 
		invInputs.duration = val;
		getROI();
        updateInvInputs(); 
	
        $("#iduration").text(invInputs.duration.toLocaleString());
    };
	$("input[name=iduration]").on("change", iTenorChanged).keyup(iTenorChanged)

	var capChanged =  function(){
		var prevVal = $("input[name=iamount]").val();
		var val = parseFloat($(this).val());
		invInputs.amt = val;
		
		$("input[name=iamount]").val(val).data("prev",prevVal);

		getROI();
		$("#investmentAmt").html("&#8358;"+invInputs.amt.toLocaleString());
        updateInvInputs();
	};

    $("#iprincipal").on("change", capChanged).keyup(capChanged);

	var capChanged1 = function(){
		var prevVal = $("input[name=iamount]").val();
		var val = parseFloat($(this).val());
		invInputs.amt = val;
		$("#iprincipal").val(val).data("prev",prevVal);
		getROI();
		updateInvInputs();
	};

	$("input[name=iamount]").on("change", capChanged1).keyup(capChanged1)
	invInputs.amt = parseFloat($("#iprincipal").val());
	invInputs.duration = parseInt($("#itenor").val());
}
 return {
	 initCalc, initInvCalc
 }
})();


$(document).ready(function(){
	Calculator.initCalc(); 
	Calculator.initInvCalc();
});