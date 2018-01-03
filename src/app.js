import $ from "jquery";
import _ from "underscore";
import es from "./js/jquery.eco-scroll";
import fb from "firebase";
import Bb from "backbone";
import Mn from "backbone.marionette";

//import "./css/home_wall.scss";
import tplMain from './template/main.html';
import tplList from './template/list.html';
// walls modules
import walls from "./view/walls";

$(function()
{   
    const RootView = Mn.View.extend({
        template: _.template(tplMain),
        regions: {
            "list": "#list",
            "wall": "#wall"
        },
        onRender: function() {
            this.showChildView("list", new ListView());
            //this.showChildView("wall", new WallView());
        }
    });

    const ListView = Mn.View.extend({
        className: "homewall wall",
        template: _.template(tplList),
        ui: {
            //"container": ".homewall"
        },
        onAttach: function() {
            this.$el.ecoScroll(
            {
                itemWidth: 400,
                itemHeight: 200,
                //rangeX : [0, 3],
                //axis : "x",
                snap : false,                     
                momentum : true,
                momentumSpeed : 10,
                onStart: function(oParam)
                {
                    return true;
                },
                onShow: function(oParam) 
                {
                    if (oParam.bNew) {
                        var me = this;
                        var sId = (oParam.x + oParam.y * 10 ) % window.myApp.wallCount;
                        //var sId = "c" + oParam.x + "_" + oParam.y;

                        firebase.database().ref('walls/'+ sId)
                        .once('value', function(snapshot) {
                            //oParam.$e.html("<div>" + sValue + "</div>").data("id", sId);
                            if (snapshot.val() !== null) {
                                var oValue = snapshot.val();
                                var oModel = new Bb.Model({
                                    x: oParam.x,
                                    y: oParam.y,
                                    wallId: sId,
                                    id: sId,
                                    q: oValue.sentence
                                });
                                var oView = new walls[oValue.view + "Item"]({model: oModel});
                                oParam.$e.data("view", oView);
                                oParam.$e.html(oView.render({
                                    model: oModel
                                }).el)
                                .addClass(oValue.view.toLowerCase());
                            }
                        });
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
                    return false;    
                },
                onStop: function(oParam)
                {
                    //console.log("stop");
                },
                onResize: function(oParam)
                {
                    //console.log("resize");
                },
                onClick: function(oParam)
                {   
                    window.myApp.router.options.bAnimate = true; 
                    window.myApp.router.options.iDirection = 1; 
                    Bb.history.navigate('wall/' + oParam.$e.data("view").model.get("id"), {trigger: true}); 
                    $('html, body').stop().animate({ scrollTop: $(document).height() }, 1200, function(){ 
                        window.myApp.router.options.bAnimate = false; 
                    });
                }          
            });
        }
    });

    const AppRouter = Mn.AppRouter.extend({
        routes: {
            "": "home",
            "wall/:id": "wall"
        },
        initialize: function() { 
            var me = this; 
            me.options.bAnimate = false; 
            me.options.iPrevScrollTop = $(window).scrollTop(); 
            me.options.iDirection = 0; 
 
            firebase.database().ref("walls")
            .on('value', function(snapshot) {
                window.myApp.wallCount = snapshot.numChildren();
            });

            $(window).scroll(function() { 
                if (me.options.bAnimate) { 
                    var iScrollDiff = $(window).scrollTop() - me.options.iPrevScrollTop; 
                    var iCurDirection = ( iScrollDiff > 0 ) ? 1 : -1; 
 
                    if (iCurDirection != me.options.iDirection) { 
                        $('html, body').stop(); 
                        me.options.bAnimate = false; 
                    } 
                     
                    me.options.iDirection = iCurDirection; 
                } 
 
                me.options.iPrevScrollTop = $(window).scrollTop(); 
            }); 
        }, 
        home: function() {
            //this.mainRegion.show(new MainView({collection: colUser}));
            //myApp.getView().getRegion("list").$el.css({top: "0"});
            myApp.getView().getRegion("wall").$el.hide();
            $('html, body').animate({ scrollTop: 0 }, 1200);
        },
        wall: function(sId) {
            var me = this;
            firebase.database().ref('walls/'+ sId)
            .once('value', function(snapshot) {
                var oObj = $.extend(snapshot.val(), {wallId: sId});
                myApp.getView().showChildView("wall", 
                    new walls[snapshot.val().view](oObj) );
            });
            
            me.options.bAnimate = true; 
            me.options.iDirection = 1; 
            $('html, body').stop().animate({ scrollTop: $(document).height() }, 1200, function() { 
                me.options.bAnimate = false; 
            }); 
            //myApp.getView().getRegion("list").currentView.ui.container.data("plugin_ecoScroll").init();
        }
    });

    const App = Mn.Application.extend({
        region: "#main",
        onStart: function(app, options) {
            var me = this;
            firebase.database().ref("walls")
            .once('value', function(snapshot) {
                window.myApp.wallCount = snapshot.numChildren();
                me.showView(new RootView());
                me.router = new AppRouter();
                Bb.history.start({pushState: true});
            });
        }
    });

    window.myApp = new App();
    myApp.start();
});
    
    