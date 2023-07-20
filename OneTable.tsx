/*
* @Author: 快的
* @Description: 出码工具自动生成，不允许修改此部分注释
* @pageUuid: 4a89ad0f-9066-4261-a87a-0575624896b8
*/

import {useRef} from 'react'; 
import M from '@block/utils';
import React from "react";



import { Records, Input, Switch, Button } from "@block/plug";

const OneTable = () => {
  const oneTableRef = useRef<Records>(null);

  // 查询数据
  const fetchData = async (
    filter,
    page: { pageNo: number; pageSize: number }
  ) => {
    let res = await M.$fetch(
      "/api/bg/supplier/showBill",
      {
        ...filter,
        page,
      }
    );

    return res;
  };

  // 点击查询按钮查询数据
  const handleQuery = (e: Event, btn: Button) => {
    btn?.loading(true);
    oneTableRef.current?.search().finally(() => {
      btn?.loading(false);
    });
  };

  // 重置筛选条件同时触发搜索
  const handleReset = () => {
    oneTableRef.current?.resetFilterValueAndSearch();
  };

  return (
    <div>
      <Records
        ref={oneTableRef}
        labelInValue={false}
        onSearch={fetchData}
        pagination={false}
      >
        <Records.Form
          labelWidth="120px"
          labelPosition="right"
          labelInValue={false}
        >
          <Records.Form.Item formItemKey="bpmCode" label="流程编号：" span={8}>
            <Input placeholder="请输入流程编号" toFormItem={true} />
          </Records.Form.Item>
          <Records.Form.Item formItemKey="name" label="姓名：" span={8}>
            <Input placeholder="请输入姓名" toFormItem={true} />
          </Records.Form.Item>
          <Records.Form.Item formItemKey="mis" label="mis：" span={8}>
            <Input placeholder="请输入mis" toFormItem={true} />
          </Records.Form.Item>
          <Records.Form.Item
            formItemKey="departName"
            label="部门名称："
            span={8}
          >
            <Input placeholder="请输入部门名称" toFormItem={true} />
          </Records.Form.Item>
          <Records.Form.Item formItemKey="deptName" label="部门全称：" span={8}>
            <Input placeholder="请输入部门全称" toFormItem={true} />
          </Records.Form.Item>
          <Records.Form.Item
            formItemKey="identCode"
            label="是否BG自采："
            span={8}
          >
            <Switch toFormItem={true} />
          </Records.Form.Item>
          <Records.Form.Item
            formItemKey="identName"
            label="是否BG自采名称："
            span={8}
          >
            <Switch toFormItem={true} />
          </Records.Form.Item>
          <Records.Form.Item span={16}>
            <div style={{ textAlign: "right" }}>
              <Button shape="text" type="primary" onClick={handleReset}>
                重置
              </Button>
              <Button
                style={{ minWidth: "80px", background: "#fff" }}
                ghost={true}
                type="primary"
                onClick={handleQuery}
              >
                搜索
              </Button>
            </div>
          </Records.Form.Item>
        </Records.Form>
        <Records.Table useSticky={true} mode="row" resizable={false}>
          <Records.Table.Column dataKey="bpmCode">
            流程编号
          </Records.Table.Column>
          <Records.Table.Column dataKey="supplierNumber">
            主键ID
          </Records.Table.Column>
          <Records.Table.Column dataKey="identCode">
            是否BG自采
          </Records.Table.Column>
          <Records.Table.Column dataKey="identName">
            是否BG自采名称
          </Records.Table.Column>
          <Records.Table.Column dataKey="name">姓名</Records.Table.Column>
          <Records.Table.Column dataKey="mis">mis</Records.Table.Column>
          <Records.Table.Column dataKey="departName">
            部门名称
          </Records.Table.Column>
          <Records.Table.Column dataKey="deptName">
            部门全称
          </Records.Table.Column>
          <Records.Table.Column dataKey="departId">部门Id</Records.Table.Column>
        </Records.Table>
      </Records>
    </div>
  );
};

export default OneTable;
