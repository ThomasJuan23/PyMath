import storageUtils from "./storageUtils";

// 内存 提高运行效率 将来要换成 redux
export default {
  // 用来存储登录用户的信息 初始值为local中读取的user
  user:storageUtils.getUser(),
  provider:{},
}