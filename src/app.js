import $ from "jquery";
import _ from "underscore";
import es from "./js/jquery.eco-scroll";
import bb from "backbone";
import mn from "backbone.marionette";

$(function()
{   
    var a = new bb.Model({name:"mike"});
    var v = mn.View.extend({
        template: _.template("<h1><%=name%></h1>")
    });
    
    console.log(new v({model: a}).render().$el.html());
    
    var $activeCell = null;
    
    $("#divContainer").ecoScroll(
    {
        itemWidth: 400,
        itemHeight: 150,
        rangeX : [-100, 100],
        rangeY : [-100, 100],
        axis : "yx",
        snap : false,                     
        momentum : true,
        momentumSpeed : 10,
        onStart: function(oParam)
        {
            if (oParam.target.getAttribute("contenteditable") === "true") {
                return false;
            }
            else {
                console.log("start");
                return true;
            }
        },
        onShow: function(oParam) 
        {
            if (oParam.bNew) {
                //var $div = $("<div class='desc'></div>");

                var starCountRef = firebase.database().ref('cells/c' + oParam.x + "_" + oParam.y + '/txt');
                starCountRef.on('value', function(snapshot) {

                    oParam.$e.html('<div class="js_blank_wrapper">' +
                        '<div class="js_blank_border">' +
                            '<span class="js_blank_sentence">Before I die I want to</span>' +
                            '<span class="js_blank_underline_wrapper">' +
                            '<span class="js_blank_underline">_______________</span>' +
                            '<span class="js_blank_input" contenteditable="true"></span>' +
                            '</span>' +
                        '</div>' +
                    '</div>');

                    if (snapshot.val() === null) {
                        //$div.text(oParam.x + ":" + oParam.y);
                        //oParam.$e.text(oParam.x + ":" + oParam.y);
                    }
                    else {
                        //$div.text(snapshot.val());
                        oParam.$e.find(".js_blank_input").text(snapshot.val());
                    }
                    //$div.appendTo(oParam.$e);
                });
                //oParam.$e.text(oParam.x + ":" + oParam.y);
            }
            oParam.$e.css({opacity: 1});    
        },
        onHide: function(oParam) 
        {
            oParam.$e.css({opacity: 0.3});
            oParam.$e.hide();    
        },
        onRemove: function(oParam)
        {
            return true;    
        },
        onStop: function(oParam)
        {
            console.log("stop");
        },
        onResize: function(oParam)
        {
            console.log("resize");
        },
        onClick: function(oParam)
        {   
            var $input;
            console.log("click");

            if ($activeCell) {
                $activeCell.$e.removeClass("active");
                var id = $activeCell.$e.prop("id"), sTxt =  $activeCell.$e.find(".js_blank_input").text();

                firebase.database().ref('cells/' + id).set({
                    txt: sTxt
                });
            }

            $activeCell = oParam;
            $input = $activeCell.$e.find(".js_blank_input");
            $activeCell.$e.addClass("active");
            $input.keyup(_.debounce(function(){
                firebase.database().ref('cells/' + $activeCell.$e.prop("id")).set({
                    txt: $input.text()
                });
            }, 1000));
        },           
    });
});