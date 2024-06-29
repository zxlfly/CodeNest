import fs from 'fs'
import path from 'path'
/**
 * 读取指定目录下的所有文件和子文件夹，生成菜单路由
 *
 * @param rootDir 指定的根目录路径
 * @returns 目录树生成的菜单结构
 */
function readPackagesDir(rootDir) {
	const result = {};
   
	// 读取packages目录下的所有文件和子文件夹 
	fs.readdirSync(rootDir).forEach((dirOrFile) => {
	  const fullPath = path.join(rootDir, dirOrFile);
	  const stat = fs.lstatSync(fullPath);
   
	  // 如果是目录，则递归读取该目录下的所有md文件 
	  if (stat.isDirectory()) {
		result[`/packages/${dirOrFile}/`] = [];
   
		const mdFiles = fs.readdirSync(fullPath).filter((file) => {
		  // 过滤掉隐藏文件和非md文件 
		  return !file.startsWith('.') && path.extname(file) === '.md';
		});
   
		mdFiles.forEach((file) => {
		  let link = path.join('/', dirOrFile, file);
          let name = path.basename(file, '.md')
        //   let match = getName(name)
        //   if(match&&match.length==3){
        //     name = `${match[2]}`
        //   }
		  result[`/packages/${dirOrFile}/`].push({
			text: name,
			link:`/packages${link}`,
		  });
		});
	  }
	});
    resetName(result)
	return result;
}
/**
 * 匹配固定格式命名的文件名
 *
 * @param str 需要匹配的字符串
 * @returns 返回匹配结果数组（如果没有匹配项则返回null）
 * 数组的第一个元素为整个匹配项，第二个元素为_sort后的第一个数字，第三个元素为第一个数字后的所有内容
 */
function getName(str){
    const match = str.match(/_sort\.(\d+)_(.+)/);
    return match
}
/**
 * 去掉固定格式用来排序的部分
 * @param {*} a 路由菜单名
 */
function resetName(a){
    Object.keys(a).forEach(key=>{
        let arr = a[key]
        if(arr&&arr.length>1){
            arr.sort(function(a,b){
                let atext = a.text
                let flagA = -1
                let flagB = -1
                let am
                if(atext){
                    am = getName(atext)
                    if(am&&am.length==3){
                        flagA = am[1]
                    }
                }
                let btext = b.text
                let bm
                if(btext){
                    bm = getName(btext)
                    if(bm&&bm.length==3){
                        flagB = bm[1]
                    }
                }
                if(flagA!=-1&&flagB!=-1){
                    return flagA -flagB
                }else{
                    return a>b
                }
            })
        }
    })
    Object.keys(a).forEach(key=>{
        let arr = a[key]
        if(arr&&arr.length>1){
            arr.forEach(item=>{
                let atext = item.text
                if(atext){
                    let am = getName(atext)
                    if(am&&am.length==3){
                        item.text = am[2]
                    }
                }
            })
        }
    })
}
/**
 * 将子集添加到父级中，更新路由
 *
 * @param menus 当前路由对象
 * @param far 父级文件夹的名称
 * @param children 子文件夹的名称数组
 * @returns 无返回值，函数会直接修改传入的 menus 对象
 */
function handleNestedMenus(menus,far,children){
    // 找到对应的父级far
    // 找到所有的子集
    // 添加到父级里面去
    if(menus&&far&&children&&children.length){
        let f
        let mkeys = Object.keys(menus)
        for (let index = 0; index < mkeys.length; index++) {
            const element = mkeys[index];
            if(element == `/packages/${far}/` ){
                f = menus[element]
                break
            }
        }
        if(f){
            let find = f.length
            for (let index = 0; index < mkeys.length; index++) {
                const element = mkeys[index];
                children.forEach((c,i) =>{
                    if(`/packages/${c}/`==element){
                        f[find+i]={
                            text: c,
                            collapsible: true,
                            collapsed: false,
                            items: menus[element],
                        }
                        // f.push(menus[element])
                    }
                })
            } 
        }
    }
}
/**
 * 获取导航数据
 *
 * @param menus 目录菜单
 * @param {[dirName:string,menuName:string]} list 需要展示的目录名
 * @returns 返回导航数据数组
 */
function getNav (menus, list){
    let res = []
    if(menus&&list){
        let m = Object.keys(menus)
        Object.keys(menus).forEach(mkey=>{
            list.forEach((l,i)=>{
                if(`/packages/${l.dirName}/` == mkey){
                    let cur = JSON.parse(JSON.stringify(menus[mkey][0]))
                    cur.text = l.menuName
                    res[i] = cur
                }
            })
        })
    }
    return res
}
/**
 * 生成关键词
 *
 * @param packagesData 路由菜单结构对象
 * @param keywordsArr 路由一级菜单以外补充的关键词，飞必传
 * @returns 返回由关键词组成的字符串，关键词之间用逗号分隔
 */
function generateKeywords(packagesData,keywordsArr=[]){
    try {
        let keywords = new Set(keywordsArr)
        Object.keys(packagesData).forEach(key =>{
            let cur = key.split('/packages/')[1]
            let keyword = cur.substring(0, cur.length-1)
            keywords.add(keyword)
            })
        return Array.from(keywords).join(',')
    } catch (error) {
        console.log(error);
        return keywordsArr.join(',')
    }
}
export {
    readPackagesDir,getName,handleNestedMenus,getNav,generateKeywords
}