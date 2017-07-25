/**
 * Created by xs on 2017/7/25.
 */
var arr1 = [1,2,3,4,5,6,7,8,9];
var arr2 = arr1.slice(0);

arr2[5] = 0;
console.log(arr1.toString());
console.log(arr2.toString());