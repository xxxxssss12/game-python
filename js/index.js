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
/**
 * 常量定义
 */
var background = "#FFE4C4";
var backgroudCanvas = document.getElementById("backgroudCanvas");
var foodCanvas = document.getElementById("foodCanvas");
var activeCanvas = document.getElementById("activeCanvas");
var foodCtx = foodCanvas.getContext("2d");
var backCtx = backgroudCanvas.getContext("2d");
var activeCtx = activeCanvas.getContext("2d");
var BACK_WIDTH = 960;   // 画布尺寸宽度
var BACK_HEIGHT = 480;   // 画布尺寸高度
var UNIT_WIDTH= 24; // 每个单元（图标）宽度
var UNIT_HEIGHT= 24; // 每个单元（图标）高度
var P_BODY = document.getElementById("python_body")
var P_FACE1 = document.getElementById("python_face1");
var P_FACE_DEAD = document.getElementById("python_face3");
var APPLE = document.getElementById("icon_apple")
var ORANGE = document.getElementById("icon_orange")
var WATERMELON = document.getElementById("icon_watermelon")
var STRAWBERRY = document.getElementById("icon_strawberry")
var BANANA = document.getElementById("icon_banana")
var PEAR = document.getElementById("icon_pear")
var FOOD_LIST = [
    {food : APPLE, name:"APPLE"},
    {food : ORANGE, name:"ORANGE"},
    {food : WATERMELON, name:"WATERMELON"},
    {food : STRAWBERRY, name:"STRAWBERRY"},
    {food : BANANA, name:"BANANA"},
    {food : PEAR, name:"PEAR"},
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
CODE_DIRECTION_MAP[37] = "left";
CODE_DIRECTION_MAP[38] = "up";
CODE_DIRECTION_MAP[39] = "right";
CODE_DIRECTION_MAP[40] = "down";
/****************************************************************************************************
 * 定义贪吃蛇对象
 * @type {{}}
 */
var foodPool = [];
var currentDirection = 2;      //0-->往左；1-->往上；2-->往右；3-->往下
var lastTime = 0;  //用来控制速度
var deltaTime = 0;
var speed = 0.1;
var python = new Python();
var deadFlag = false;
var score = 0;
var startFlag = 0;

var init = function() {
    score = 0;
    startFlag = 0;
    deadFlag = 0;
    deltaTime = 0;
    lastTime = 0;
    speed = 0.1;
    currentDirection = 2;
    foodPool = [];
    onScoreChange(score);
    // 绘制背景
    backCtx.fillStyle=background;
    backCtx.fillRect(0,0,BACK_WIDTH,BACK_HEIGHT);
    activeCtx.clearRect(0,0, BACK_WIDTH, BACK_HEIGHT);
    foodCtx.clearRect(0,0, BACK_WIDTH, BACK_HEIGHT);
    python.init(5, 0, BACK_HEIGHT/2, P_FACE1, P_BODY, UNIT_WIDTH, UNIT_HEIGHT);
    // 绘制蛇
    activeCtx.drawImage(python.head.img, python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
    for (var i=0; i<python.bodyList.length; i++) {
        activeCtx.drawImage(python.bodyList[i].img, python.bodyList[i].x, python.bodyList[i].y, UNIT_WIDTH, UNIT_HEIGHT);
    }
    // 绘制食物
    for (var i=0; i<15; i++) {
        x = Math.random() * (BACK_WIDTH - UNIT_WIDTH);
        y = Math.random() * (BACK_HEIGHT - UNIT_HEIGHT);
        var foodIndex = parseInt(Math.random() * FOOD_LIST.length);
        if (foodIndex < FOOD_LIST.length) {
            var food = new Food(FOOD_LIST[foodIndex].name, FOOD_LIST[foodIndex].food, x, y);
            foodPool.push(food);
            foodCtx.drawImage(food.img, x, y, UNIT_WIDTH, UNIT_HEIGHT);
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
function isChangeDirection(directionChange, unit, afterX, afterY) {
    if (unit.direction == 0) {
        //左
        if (unit.x > directionChange.x && afterX <= directionChange.x) {
            return true;
        }
    } else if (unit.direction == 1) {
        //上
        if (unit.y > directionChange.y && afterY <= directionChange.y) {
            return true;
        }
    } else if (unit.direction == 2) {
        //右
        if (unit.x < directionChange.x && afterX >= directionChange.x) {
            return true;
        }
    } else if (unit.direction == 3) {
        //下
        if (unit.y < directionChange.y && afterY >= directionChange.y) {
            return true;
        }
    } else {
        return false;
    }
}
function mvPythonBody(unit, afterX, afterY) {
    var directionChange = unit.directionChange[0];
    if (!directionChange) {
        // console.log("mv蛇身..没有拐弯记录");
        unit.x = afterX;
        unit.y = afterY;
        return;
    };
    if (isChangeDirection(directionChange, unit, afterX, afterY)) {
        // console.log("mv蛇身..需要拐弯..当前坐标x=" + unit.x + ",y=" + unit.y + ",方向=" + CODE_DIRECTION_MAP[unit.direction] + ";拐弯前方向="+CODE_DIRECTION_MAP[directionChange.beforeDirection]+",拐弯后方向=" +CODE_DIRECTION_MAP[directionChange.afterDirection]);
        directionChange = unit.directionChange.shift();
        var delta = Math.abs(afterY - unit.y);
        if (delta == 0) delta = Math.abs(afterX - unit.x);
        var tmp = Math.abs(directionChange.x - unit.x);
        if (tmp == 0) tmp = Math.abs(directionChange.y - unit.y);
        unit.x = directionChange.x;
        unit.y = directionChange.y;
        unit.direction = directionChange.afterDirection;
        // 校正当前节的位置
        if (delta - tmp != 0) {
            var moveUnit = Math.abs(delta - tmp);
            var mvInfo = DIRECTION[CODE_DIRECTION_MAP[unit.direction]];
            unit.x = unit.x + moveUnit * mvInfo.x;
            unit.y = unit.y + moveUnit * mvInfo.y;
        }
    } else {
        unit.x = afterX;
        unit.y = afterY;
    }
}
function singleTouch(food, afterX, afterY, unitWidth, unitHeight) {
    var x = food.x;
    var y = food.y;
    var isTouch = false;
    for (var i=0; i<4; i++) {
        if (afterX-x > 0 && afterX-x-unitWidth < 0 && afterY-y > 0 && afterY-y-unitHeight < 0){
            isTouch = true;
            break;
        }
        var direction = i+2;
        if (direction > 3) direction -= 4;
        var mvInfo = DIRECTION[CODE_DIRECTION_MAP[direction]];
        afterX = afterX + mvInfo.x * unitWidth;
        afterY = afterY + mvInfo.y * unitHeight;
    }
    return isTouch;
}
var checkTouch = function (foodPool, afterX, afterY, unitWidth, unitHeight) {
    var food = false;
    for (var i=0; i<foodPool.length; i++) {
        if (singleTouch(foodPool[i], afterX, afterY, unitWidth, unitHeight)) {
            food = foodPool[i];
            break;
        }
    }
    foodPool.splice(i,1);
    return food;
};
function onScoreChange(score) {
    if (score % 1000 == 0 && score != 0 && score < 6000) speed += 0.05;
    $("#score").text(score);
}
/**
 * 校验是否死亡
 * @param python
 * @param BACK_WIDTH
 * @param BACK_HEIGHT
 * @param UNIT_WIDTH
 * @param UNIT_HEIGHT
 */
function checkDead(python, BACK_WIDTH, BACK_HEIGHT, UNIT_WIDTH, UNIT_HEIGHT) {
    // 碰到边界
    var head = python.head;
    if (head.x <0 || head.x > BACK_WIDTH-UNIT_WIDTH
        || head.y < 0 || head.y > BACK_HEIGHT - UNIT_HEIGHT
    ) {
        return true;
    }
    // TODO 碰到自己身体
    return false;
}
/**
 * 死亡处理
 */
var onDead = function () {
    startFlag = 0;
    onPause();
    python.head.img = P_FACE_DEAD;
    activeCtx.clearRect(python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
    activeCtx.drawImage(python.head.img, python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
};
var mvPythonHead = function (python, afterX, afterY) {
    var food = checkTouch(foodPool, afterX, afterY, UNIT_WIDTH, UNIT_HEIGHT);
    if (food) {
        var pythonTailBefore = python.bodyList[0];
        var direction = pythonTailBefore.direction;
        var mvInfo = DIRECTION[CODE_DIRECTION_MAP[direction]];
        var x = pythonTailBefore.x - mvInfo.x * UNIT_WIDTH;
        var y = pythonTailBefore.y - mvInfo.y * UNIT_HEIGHT;
        var directionChange = pythonTailBefore.directionChange.slice(0);
        var pythonTailNew = new PythonUnit(x,y,P_BODY, direction, directionChange);
        python.bodyList.unshift(pythonTailNew);
        score += 100;
        onScoreChange(score);
        // 绘制新的食物
        foodCtx.clearRect(food.x, food.y, UNIT_WIDTH, UNIT_HEIGHT);
        food = createFood();
        foodPool.push(food);
        foodCtx.drawImage(food.img, food.x, food.y, UNIT_WIDTH, UNIT_HEIGHT);
    }

    // checkDead
    var isDead = checkDead(python,BACK_WIDTH, BACK_HEIGHT, UNIT_WIDTH, UNIT_HEIGHT);
    if (isDead) {
        deadFlag = true;
        onDead();
    }
    // mv
    python.head.x = afterX;
    python.head.y = afterY;
};
var createFood = function() {
    x = Math.random() * (BACK_WIDTH - UNIT_WIDTH);
    y = Math.random() * (BACK_HEIGHT - UNIT_HEIGHT);
    var foodIndex = parseInt(Math.random() * FOOD_LIST.length);
    if (foodIndex < FOOD_LIST.length)
        return new Food(FOOD_LIST[foodIndex].name, FOOD_LIST[foodIndex].food, x, y);
    else
        return createFood();
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
    var mvDistance = speed * deltaTime;
    var afterX = python.head.x + headMvInfo.x * mvDistance;
    var afterY = python.head.y + headMvInfo.y * mvDistance;
    mvPythonHead(python, afterX, afterY);
    activeCtx.drawImage(python.head.img, python.head.x, python.head.y, UNIT_WIDTH, UNIT_HEIGHT);
    // 再移动蛇身
    for (var i=python.bodyList.length-1; i>=0; i--) {
        // console.log("mv蛇身..index=" + i);
        var unit = python.bodyList[i];
        activeCtx.clearRect(unit.x, unit.y, UNIT_WIDTH, UNIT_HEIGHT);
        var bodyMvInfo = DIRECTION[CODE_DIRECTION_MAP[unit.direction]];
        var afterX = unit.x + bodyMvInfo.x * mvDistance;
        var afterY = unit.y + bodyMvInfo.y * mvDistance;
        mvPythonBody(unit, afterX, afterY);
        activeCtx.drawImage(unit.img, unit.x, unit.y, UNIT_WIDTH, UNIT_HEIGHT);
    }
};
function onPause() {
    lastTime = 0;
    deltaTime = 0;
}
function changeDirection(code) {
    var _direction = undefined;
    if (code >= 37 && code <= 40 && startFlag) _direction = code - 37;
    if (_direction != undefined) {
        if (Math.abs(currentDirection - _direction) == 1
            || Math.abs(currentDirection - _direction + 4) == 1
            || Math.abs(currentDirection - _direction -4) == 1) {
            currentDirection = _direction;
        }
    }
}
var onKeyPress = function(code) {
    switch(code) {
        case 13 :
            // 开始/暂停
            if (deadFlag) init();
            else {
                startFlag = !startFlag;
                if (startFlag) {
                    requestAnimationFrame(gameLoop);
                } else {
                    onPause();
                }
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
/**
 * 主循环
 */
function gameLoop() {
    if (startFlag) {
        refreshDeltaTime();
        requestAnimationFrame(gameLoop);
        mvPython(speed, deltaTime);
    }
}