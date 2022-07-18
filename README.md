# 项目

## 项目搭建
Koa

### 项目结构
1. app 环境变量
   1. 统一的配置，端口、数据库信息
   2. 数据库的封装，创建连接池
2. router 路由处理，中间件controller统一处理
3. controller 处理函数控制器
4. service 操作数据库
5. constants 常量数据定义，例如错误信息的统一定义
6. utils 工具函数
7. main.js 主入口

### 环境变量配置 .env
使用库 dotenv 加载根目录中的.env文件到环境变量