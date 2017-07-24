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
var background = "#FFE4C4";
var backgroudCanvas = document.getElementById("backgroudCanvas");
var foodCanvas = document.getElementById("foodCanvas");
var activeCanvas = document.getElementById("activeCanvas");
var foodCtx = foodCanvas.getContext("2d");
var backCtx = backgroudCanvas.getContext("2d");
var activeCtx = activeCanvas.getContext("2d");
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
CODE_DIRECTION_MAP[0] = "left";
CODE_DIRECTION_MAP[1] = "up";
CODE_DIRECTION_MAP[2] = "right";
CODE_DIRECTION_MAP[3] = "down";
CODE_DIRECTION_MAP[269] = "up";
CODE_DIRECTION_MAP[270] = "down";
CODE_DIRECTION_MAP[271] = "left";
CODE_DIRECTION_MAP[272] = "right";
/**
 * 定义贪吃蛇对象
 * @type {{}}
 */
var pythonList = [];    //贪吃蛇定义一个数组来维护
var directChangeLocation = [];
var currentDirection = 2;      //0-->往左；1-->往上；2-->往右；3-->往下
var lastTime = 0;  //用来控制速度
var deltaTime = 0;
var speed = 0.1;
var python = new Python();
var init = function() {
    // 绘制北京
    backCtx.fillStyle=background;
    backCtx.fillRect(0,0,BACK_WIDTH,BACK_HEIGHT);
    python.init(3, 0, BACK_HEIGHT/2, P_FACE1, P_BODY, UNIT_WIDTH, UNIT_HEIGHT);
    // 绘制蛇
    activeCtx.drawImage(python.head.img, python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
    for (var i=0; i<python.bodyList.length; i++) {
        activeCtx.drawImage(python.bodyList[i].img, python.bodyList[i].x, python.bodyList[i].y, UNIT_WIDTH, UNIT_HEIGHT);
    }
    // 绘制食物
    for (var i=0; i<10; i++) {
        x = Math.random() * (BACK_WIDTH - UNIT_WIDTH);
        y = Math.random() * (BACK_HEIGHT - UNIT_HEIGHT);
        var foodIndex = parseInt(Math.random() * FOOD_LIST.length);
        if (foodIndex < FOOD_LIST.length) {
            foodCtx.drawImage(FOOD_LIST[foodIndex].food, x, y, UNIT_WIDTH, UNIT_HEIGHT);
        }
    }
}
var refreshDeltaTime = function () {
    if (!lastTime) lastTime = Date.now();
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
};
/**
 * 检查是否需要改变方向，并校正坐标
 * @param nowUnit
 * @param beforeUnit
 */
function checkDirection(nowUnit, beforeUnit) {
    var beforeDirection = beforeUnit.direction; // 头一节的方向

}
/**
 * 方向改变事件
 * @param beforeDirection
 * @param afterDirection
 */
function onDirectChange(beforeDirection, afterDirection) {
    // 记录需要进行移动的位置
    for (var i=python.bodyList.length-1; i>=0; i--) {
        var unit = python.bodyList[i];
        unit.directionChange.push(new DirectionChange(beforeDirection, afterDirection, python.head.x, python.head.y));
    }
}
function onMvPythonBody(unit, afterX, afterY) {
    var directionChange = unit.directionChange[0];
    if (!directionChange) return;
    if (unit.direction == 0) {
        //左
        unit.directionChange.shift();

    }
}
/**
 * 移动贪吃蛇
 */
var mvPython = function (speed, deltaTime) {
    // 先移动蛇头
    if (currentDirection != python.head.direction) onDirectChange(python.head.direction, currentDirection);
    python.head.direction = currentDirection;
    var headMvInfo = DIRECTION[CODE_DIRECTION_MAP[currentDirection]];
    activeCtx.clearRect(python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
    python.head.x = python.head.x + headMvInfo.x * speed * deltaTime;
    python.head.y = python.head.y + headMvInfo.y * speed * deltaTime;
    activeCtx.drawImage(python.head.img, python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
    // 再移动蛇身
    for (var i=python.bodyList.length-1; i>=0; i--) {
        var unit = python.bodyList[i];
        activeCtx.clearRect(unit.x, unit.y, UNIT_WIDTH, UNIT_HEIGHT);
        var bodyMvInfo = DIRECTION[CODE_DIRECTION_MAP[unit.direction]];
        var afterX = unit.x + bodyMvInfo.x * speed * deltaTime;
        var afterY = unit.y + bodyMvInfo.y * speed * deltaTime;
        if (i == python.bodyList.length - 1) {
            onMvPythonBody(unit, python.head, afterX, afterY);
        } else {
            onMvPythonBody(unit, python.bodyList[i+1], afterX, afterY);
        }

        unit.x = afterX
        unit.y = afterY
        activeCtx.drawImage(unit.img, unit.x, unit.y, UNIT_WIDTH, UNIT_HEIGHT);
    }
};
function onPause() {
    i=0;
    lastTime = 0;
    deltaTime = 0;
}
var i=0;
function gameLoop() {
    if (startFlag) {
        refreshDeltaTime();
        if (i++ < 100) requestAnimationFrame(gameLoop);
        else {
            startFlag = false;
            onPause();
        }
        mvPython(speed, deltaTime);
        console.log(i + "..." + deltaTime);
    }
}
var onKeyPress = function(code) {
    switch(code) {
        case 13 :
            // 开始/暂停
            startFlag = !startFlag;
            if (startFlag) {
                requestAnimationFrame(gameLoop);
            } else {
                onPause();
            }
            break;
        default :
            changeDirection(code);
            break;
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