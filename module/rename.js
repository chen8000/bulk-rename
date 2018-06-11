const fs = require('fs');
const path = require('path');

let app = {
    
    //从目录或文件数组里删除.DS文件
    removeDs:(res) => {
        
        // findIndex 接收三个参数
        // 第一个参数  数组当前的value
        // 第二个参数  当前数组元素的下标
        // 第三个参数  当前遍历的数组
        let Ds_index = res.findIndex((value, index, arr) => {
            return value == '.DS_Store';
        });

        //如果有这个文件，那么删除这个数组元素
        if(Ds_index >= 0){
            res.splice(Ds_index,1)
        }
    },
    rename : (filePath) => {
        fs.readdir(filePath,(err, res) => {

            if(err){
                console.log(err);
                return;
            }
        
            //删除.Ds文件
            app.removeDs(res);
        
            // 拿到了当前文件夹下的目录和文件 -- res
        // 循环目录看看是文件还是目录，如果是文件，那么改名，如果是目录那么显示出这个目录下的文件，
        // 循环这个目录下的文件
            (function fsForEach(res, filePath){
                
                res.forEach((value, index, arr) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                
                    fs.stat(filePath+'/'+value, (err, stats) => {
                        if(err){
                            console.log(err);
                            return;
                        }
            
                        
                        //是目录，那么往下找一级
                        if(stats.isDirectory()){
            
                            fs.readdir(filePath + '/' + value, (err, res) => {
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                //删除.Ds文件
                                app.removeDs(res);
                                
                                //循环这个目录里的文件及目录
                                fsForEach(res, filePath + '/' + value);
                                // return;
                            })
                        }
                        
                        // 是个文件  那么重命名这个文件    
                        if(stats.isFile()){
                            
                            // return;
                            //获取文件的后缀名
                            let suf = path.extname(value);
        
                            //将要被改名的文件路径
                            let isFilePath = filePath + '/' + value;
        
                            //改完名的文件路径
                            
                            //重命名为此文件夹的名字
                            fs.rename(isFilePath, filePath + '/' + path.parse(filePath).name + index + suf, (err) => {
                                if(err){
                                    console.log(err);
                                    return;
                                }
                            });
                        }
                    });
                });
        
            })(res, filePath);
            
        });
    }
    
}

//把这个模块暴露出去
module.exports = app;