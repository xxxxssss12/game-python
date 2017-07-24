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
var BACK_WIDTH = 960;   // 画布尺寸宽度
var BACK_HEIGHT = 720;   // 画布尺寸高度
var UNIT_WIDTH= 24; // 每个单元（图标）宽度
var UNIT_HEIGHT= 24; // 每个单元（图标）高度
var P_BODY = document.getElementById("python_body")
var P_FACE1 = document.getElementById("python_face1")
var APPLE = document.getElementById("icon_apple")
var ORANGE = document.getElementById("icon_orange")
var WATERMELON = document.getElementById("icon_watermelon")
var STRAWBERRY = document.getElementById("icon_strawberry")
var BANANA = document.getElementById("icon_banana")
var PEAR = document.getElementById("icon_pear")
var startFlag = 0;
var FOOD_LIST = [
    {food : APPLE},
    {food : ORANGE},
    {food : WATERMELON},
    {food : STRAWBERRY},
    {food : BANANA},
    {food : PEAR},
    ];
var DIRECTION = {
    up :{x:0, y:-1},
    down :{x:0, y:1},
    right :{x:1, y:0},
    left :{x:-1, y:0},
};
var CODE_DIRECTION_MAP = [];
CODE_DIRECTION_MAP[269] = "up";
CODE_DIRECTION_MAP[270] = "down";
CODE_DIRECTION_MAP[271] = "left";
CODE_DIRECTION_MAP[272] = "right";
/**
 * 定义贪吃蛇对象
 * @type {{}}
 */
var pythonList = [];    //贪吃蛇定义一个数组来维护
var direction = 0;      //0-->往左；1-->往上；2-->往右；3-->往下
var lastTime = Date.now();  //用来控制速度
var deltaTime = 0;
var python = new Python();
var init = function() {
    ctx.fillStyle=background;
    ctx.fillRect(0,0,BACK_WIDTH,BACK_HEIGHT);
    python.init(3, 0, BACK_HEIGHT/2, P_FACE1, P_BODY, UNIT_WIDTH, UNIT_HEIGHT);
    for (var i=0; i<python.bodyList.length; i++) {
        ctx.drawImage(python.bodyList[i].img, python.bodyList[i].x, python.bodyList[i].y, UNIT_WIDTH, UNIT_HEIGHT);
    }
    ctx.drawImage(python.head.img, python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
    for (var i=0; i<10; i++) {
        x = Math.random() * (BACK_WIDTH - UNIT_WIDTH);
        y = Math.random() * (BACK_HEIGHT - UNIT_HEIGHT);
        var foodIndex = parseInt(Math.random() * FOOD_LIST.length);
        if (foodIndex < FOOD_LIST.length) {
            ctx.drawImage(FOOD_LIST[foodIndex].food, x, y, UNIT_WIDTH, UNIT_HEIGHT);
        }
    }
}
var refreshDeltaTime = function () {
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
};
var i=0;
function gameLoop() {
    if (startFlag) {
        refreshDeltaTime();
        if (i++ < 100) requestAnimationFrame(gameLoop);
        else startFlag = !startFlag;
        console.log(i + "...");
    }
}
var onKeyPress = function(code) {
    switch(code) {
        case 13 :
            // 开始/暂停
            i=0;
            startFlag = !startFlag;
            if (startFlag) {
                requestAnimationFrame(gameLoop);
            }
            break
        case 269 :
            // up
            break;
        case 270 :
            // down
        case 271 :
            // left
        case 272 :
            // right
    }
}

$(function() {
    init();
    $("body").bind("keydown", function(e) {
        // 兼容FF和IE和Opera
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        onKeyPress(code);
    })
})