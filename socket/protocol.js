export const protocol = {
  C2S_HEARTBEAT: 0, //客户端发送给服务端心跳
  C2S_REPORT_EDIT: 1, // 进入报告编辑
  C2S_QUIT_REPORT_EDIT: 2, // 退出报告编辑
  C2S_REPORTOUTLINE_EDIT: 3, // 进入章节编辑
  C2S_QUIT_REPORTOUTLINE_EDIT: 4, // 退出章节编辑
  C2S_NODE_EDIT: 5, // 进入节点编辑
  C2S_QUIT_NODE_EDIT: 6, // 退出节点编辑
  
  S2C_HEARTBEAT: 0, // 服务端发送给客户端心跳包
  S2C_NODE_EDIT_INFO: 1, // 节点编辑信息
  S2C_REPORT_EDIT_INFO: 2, // 报告页编辑信息
  S2C_REPORTOUTLINE_EDIT_INFO: 3 // 章节页编辑信息
  
}
