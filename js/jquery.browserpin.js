function checkPinCode(pinnumber) {
    if(pinnumber ==="1314"){
        window.location.href="arch/index.htm";
    }else{
        $("#secretmessage").html("«Î ‰»Î1314").fadeIn().delay(1000).fadeOut();
    }
}
function keypressed(event) {

    if (!event) {
        event = arguments.callee.caller.arguments[0] || window.event;
    }

    $(document).keydown(function (e) {
        if (e.keyCode == 8) e.preventDefault();
    });
    if (event.keyCode == '8' || event.keyCode == '46') {
        var currentValue = document.getElementById("pinnumber").value;
        var currentValueLength = (currentValue.length - 1)
        document.getElementById("pinnumber").value = currentValue.substring(0, currentValueLength);
    }
    if (event.keyCode == '13' || event.keyCode == '18') {
        numberEntered('go');
    }
    else if (document.getElementById("pinnumber").value.length == '4') {
        $('#inline_example1').val('').trigger('mouseup');
        $('#inline_example1').unbind('mousedown');
        $('#inline_example1').jrumble({rumbleEvent:'mousedown', rangeX:6, rangeY:0, rangeRot:0});
        $('#inline_example1').trigger('mousedown');
        setTimeout(function () {
            $('#inline_example1').val('').trigger('mouseup');
            $('#inline_example1').unbind('mousedown');
        }, 500);
    }
    else {
        if (event.keyCode == '48' || event.keyCode == '96') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '0');
        }
        if (event.keyCode == '49' || event.keyCode == '97') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '1');
        }
        if (event.keyCode == '50' || event.keyCode == '98') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '2');
        }
        if (event.keyCode == '51' || event.keyCode == '99') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '3');
        }
        if (event.keyCode == '52' || event.keyCode == '100') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '4');
        }
        if (event.keyCode == '53' || event.keyCode == '101') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '5');
        }
        if (event.keyCode == '54' || event.keyCode == '102') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '6');
        }
        if (event.keyCode == '55' || event.keyCode == '103') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '7');
        }
        if (event.keyCode == '56' || event.keyCode == '104') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '8');
        }
        if (event.keyCode == '57' || event.keyCode == '105') {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + '9');
        }
        showDigits();
    }
}
function numberEntered(thenumber) {
    if (thenumber == 'go') {
        if (document.getElementById("pinnumber").value.length == '4') {
            checkPinCode(document.getElementById("pinnumber").value);
        }
        else {

            $('#inline_example1').val('').trigger('mouseup');
            $('#inline_example1').unbind('mousedown');
            $('#inline_example1').jrumble({rumbleEvent:'mousedown', rangeX:6, rangeY:0, rangeRot:0});
            $('#inline_example1').trigger('mousedown');
            setTimeout(function () {
                $('#inline_example1').val('').trigger('mouseup');
                $('#inline_example1').unbind('mousedown');
            }, 500);
        }
    }
    else if (thenumber == 'back') {
        var currentValue = document.getElementById("pinnumber").value;
        var currentValueLength = (currentValue.length - 1)
        document.getElementById("pinnumber").value = currentValue.substring(0, currentValueLength);
        showDigits();
    }
    else {
        if (document.getElementById("pinnumber").value.length == '4') {
            $('#inline_example1').val('').trigger('mouseup');
            $('#inline_example1').unbind('mousedown');
            $('#inline_example1').jrumble({rumbleEvent:'mousedown', rangeX:6, rangeY:0, rangeRot:0});
            $('#inline_example1').trigger('mousedown');
            setTimeout(function () {
                $('#inline_example1').val('').trigger('mouseup');
                $('#inline_example1').unbind('mousedown');
            }, 500);
        }
        else {
            document.getElementById('pinnumber').value = (document.getElementById('pinnumber').value + thenumber);
            showDigits();
        }
    }
}
function showDigits() {
    if (document.getElementById("pinnumber").value.length == '0') {
        $('#blank1').show();
        $('#blank2').show();
        $('#blank3').show();
        $('#blank4').show();
        $('#hidden1').hide();
        $('#hidden2').hide();
        $('#hidden3').hide();
        $('#hidden4').hide();
    }
    else if (document.getElementById("pinnumber").value.length == '1') {
        $('#blank1').hide();
        $('#blank2').show();
        $('#blank3').show();
        $('#blank4').show();
        $('#hidden1').show();
        $('#hidden2').hide();
        $('#hidden3').hide();
        $('#hidden4').hide();
    }
    else if (document.getElementById("pinnumber").value.length == '2') {
        $('#blank1').hide();
        $('#blank2').hide();
        $('#blank3').show();
        $('#blank4').show();
        $('#hidden1').show();
        $('#hidden2').show();
        $('#hidden3').hide();
        $('#hidden4').hide();
    }
    else if (document.getElementById("pinnumber").value.length == '3') {
        $('#blank1').hide();
        $('#blank2').hide();
        $('#blank3').hide();
        $('#blank4').show();
        $('#hidden1').show();
        $('#hidden2').show();
        $('#hidden3').show();
        $('#hidden4').hide();
    }
    else if (document.getElementById("pinnumber").value.length == '4') {
        $('#blank1').hide();
        $('#blank2').hide();
        $('#blank3').hide();
        $('#blank4').hide();
        $('#hidden1').show();
        $('#hidden2').show();
        $('#hidden3').show();
        $('#hidden4').show();
    }
}
function init() {
    $(".example8").colorbox({width:"343px", height:"380px", open:true, overlayClose:false, escKey:false, scrolling:false,
        inline:true, close:"", href:"#inline_example1"});
}
		