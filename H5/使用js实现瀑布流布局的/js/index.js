/**
 * Created by h on 2019/11/15.
 */
function $(id) {
    return typeof id === 'string'?document.getElementById(id):id;
}

//当网页加载完毕的时候
window.onload = function () {
    //瀑布流布局
    waterFall('main','box');
    //滚动屏幕加载盒子
    window.onscroll = function () {
        //判断是否符合加载新图的条件
        if (cheachWillLoad()){
            //加载新图
            var data = {'dataImg':[{'img':'1.jpg'},
                {'img':'2.jpg'},{'img':'3.jpg'},
                {'img':'4.jpg'},{'img':'5.jpg'},{'img':'6.jpg'}
                ,{'img':'7.jpg'},{'img':'8.jpg'},{'img':'9.jpg'},{'img':'10.jpg'}]}
            //加载数据
            for(var i = 0 ; i<data.dataImg.length;i++){
                //创建box
                var newBox = document.createElement('div');
                newBox.className = 'box';
                $('main').appendChild(newBox);
                //创建pic
                var newPic = document.createElement('div');
                newPic.className = 'pic';
                newBox.appendChild(newPic);
                //创建img
                var newImg = document.createElement('img');
                newImg.src = 'imgs/'+data.dataImg[i].img;
                newPic.appendChild(newImg);
            }
            //瀑布流布局
            waterFall('main','box');
        }
    }
}


//实现瀑布流代码
function waterFall(parent, box) {
    //父盒子居中

    //1.1 拿到父盒子里面所有的子盒子
    var allBox = $(parent).getElementsByClassName(box);
    //1.2 求出盒子的宽度
    var boxWidth = allBox[0].offsetWidth;
    //1.3 求出浏览器的宽度
    var screenWidth = document.body.offsetWidth;
    //1.4 求出真实的列数 取整数
    var cols = Math.floor(screenWidth / boxWidth);

    //1.5需要让Main居中显示
    $(parent).style.width = boxWidth * cols + 'px';
    $(parent).style.margin = '0 auto';


    //-----子盒子定位------
    //1.1 数组保存第一行的高度
    var heightArr = [];
    //1.2 遍历
    for(var i = 0;i < allBox.length;i++){
        //1.2.1 求出单个盒子的高度
        var boxHeight = allBox[i].offsetHeight;
        if(i<cols){//判断是否是第一行的盒子
            heightArr.push(boxHeight);
        }else{//第二个盒子.布局!!
            //1.2.2 求出最矮的盒子
            var minBoxHeight = Math.min.apply(this,heightArr);
            //1.2.3 求出最矮盒子的索引
            var minBoxIndex = getMinBoxIndex(minBoxHeight,heightArr);
            //1.2.4 布局定位
            allBox[i].style.position = 'absolute';
            allBox[i].style.top = minBoxHeight + 'px';
            allBox[i].style.left = minBoxIndex * boxWidth + 'px';
            //1.2.5 更新数组的高度
            heightArr[minBoxIndex] += boxHeight;
        }
    }
    console.log(heightArr);


}


//取出数组中特定值的角标
function getMinBoxIndex(val, arr) {
    for(var i in arr){
        if(val == arr[i]) return i;
    }
}

//判断是否应该加载新的图片
function cheachWillLoad() {
    //取出所有的盒子
    var allBox = $('main').getElementsByClassName('box');
    //拿到最后一个盒子
    var lastBox = allBox[allBox.length - 1];
    //求出最后一个盒子的头部的偏移量
    var lastBoxOffsetTop = lastBox.offsetTop;
    //求出浏览器的高度 标准模式 和 混杂模式
    var screenHeight = document.body.offsetHeight || document.documentElement.clientHeight;
    //求出页面的偏移量的高度
    var scrollTopHeight = document.body.scrollTop;

    //判断
    return lastBoxOffsetTop <= screenHeight + scrollTopHeight;

}