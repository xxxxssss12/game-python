/**
 * 贪吃蛇对象
 * @type {{}}
 */
function Python(head, bodyList) {
    this.head = head;
    this.bodyList = bodyList;
    this.size = 1 + bodyList.length;
}

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

}