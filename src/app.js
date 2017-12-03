import $ from "jquery";
import _ from "underscore";
import es from "./js/jquery.eco-scroll";
import bb from "backbone";
import mn from "backbone.marionette";
import fill_in_the_blank_view from "./view/fill_in_the_blank";

$(function()
{   
    /*
    var a = new bb.Model({txt:"mike"});
    var v = mn.View.extend({
        template: _.template("<h1><%=txt%></h1>")
    });
    
    console.log(new fill_in_the_blank_view({model: a}).render().$el.html());
    */

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
                var starCountRef = firebase.database().ref('cells/c' + oParam.x + "_" + oParam.y + '/txt');
                starCountRef.on('value', function(snapshot) {
                    var oModel = new bb.Model({
                            txt: snapshot.val()
                    });
                    var oView = new fill_in_the_blank_view({model: oModel});
                    oParam.$e.html(oView.render({
                        model: oModel
                    }).el);
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