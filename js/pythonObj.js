/**
 * 贪吃蛇对象
 * @type {{}}
 */
function Python() {
}
function Python(head, bodyList) {
    this.head = head;
    this.bodyList = bodyList;
    if (bodyList)
        this.size = head?1:0 + bodyList.length;
    else
        this.size = head?1:0;
    this.direction = 2;
}
/**
 * 贪吃蛇每一节
 * @param x
 * @param y
 * @param img
 * @constructor
 */
function PythonUnit(x, y, img) {
    // 绝对定位
    this.x = x;
    this.y = y;
    this.img = img; // icon图标
}
/**
 * 初始化
 * @param length
 * @param tailX 尾节点坐标
 * @param tailY
 */
Python.prototype.init = function(length, tailX, tailY, headImg, bodyImg, imgWidth, imgHeight) {
    if (!length) length = 2;
    var x = tailX; var y=tailY;
    var bodyList = [];
    for (var i=0; i< length; i++) {
        var bodyUnit = new PythonUnit(x,y, bodyImg);
        bodyList.push(bodyUnit);
        x += imgWidth;
    }
    var head = new PythonUnit(x,y, headImg);
    this.head = head;
    this.bodyList = bodyList;
    this.size = 1 + bodyList.length;
    this.direction = 2;
}