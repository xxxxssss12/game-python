/**
 * Created by xs on 2017/7/23.
 */
window.requestAnimFrame = (function(){                //浏览器的兼容设置
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);     //定义每秒执行60次动画
        };
})();
var i=0;
var background = "#FFE4C4"
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var BACK_WIDTH = 960;   //画布尺寸宽度
var BACK_HEIGHT = 720;   //画布尺寸高度
var UNIT_WIDTH= 24; //每个单元（图标）宽度
var UNIT_HEIGHT= 24; //每个单元（图标）高度
var P_BODY = document.getElementById("python_body")
var P_FACE1 = document.getElementById("python_face1")
var APPLE = document.getElementById("icon_apple")
var ORANGE = document.getElementById("icon_orange")
var WATERMELON = document.getElementById("icon_watermelon")
var STRAWBERRY = document.getElementById("icon_strawberry")
var BANANA = document.getElementById("icon_banana")
var PEAR = document.getElementById("icon_pear")
var FOOD_LIST = [
    {food : APPLE},
    {food : ORANGE},
    {food : WATERMELON},
    {food : STRAWBERRY},
    {food : BANANA},
    {food : PEAR},
    ];
/**
 * 定义贪吃蛇对象
 * @type {{}}
 */
var pythonList = [];    //贪吃蛇定义一个数组来维护
var direction = 0;      //0-->往左；1-->往上；2-->往右；3-->往下
var lastTime = Date.now();  //用来控制速度
var deltaTime = 0;
var init = function() {
    ctx.fillStyle=background;
    ctx.fillRect(0,0,BACK_WIDTH,BACK_HEIGHT);
    python.init();
    var x = 0;var y=BACK_HEIGHT/2;
    ctx.drawImage(P_BODY, x, y, UNIT_WIDTH, UNIT_HEIGHT);
    x += 24;
    ctx.drawImage(P_BODY, x, y, UNIT_WIDTH, UNIT_HEIGHT);
    x += 24;
    ctx.drawImage(P_FACE1, x, y, UNIT_WIDTH, UNIT_HEIGHT);
    for (var i=0; i<3; i++) {
        x = Math.random() * (BACK_WIDTH - UNIT_WIDTH);
        y = Math.random() * (BACK_HEIGHT - UNIT_HEIGHT);
        var foodIndex = parseInt(Math.random() * FOOD_LIST.length);
        if (foodIndex < FOOD_LIST.length) {
            ctx.drawImage(FOOD_LIST[foodIndex].food, x, y, UNIT_WIDTH, UNIT_HEIGHT);
        }
    }
}
$(function() {
    init();
    requestAnimationFrame(gameLoop);
})


var refreshDeltaTime = function () {
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
};
var gameLoop = function() {
    refreshDeltaTime();
    requestAnimationFrame(gameLoop());
}