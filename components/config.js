import { useState, useEffect } from "react";
import {
  Drawer,
  Notification,
  Popconfirm,
  Form,
  Grid,
  Input,
  Button,
} from "@arco-design/web-react";

import { delLogs, getLogs } from "../data/db";
import graphState from "../hooks/use-graph-state";
import tableModel from "../hooks/table-model";
import { useApplicationsCtx } from "../hooks/use-applications-ctx";

function ConfigBaseForm() {
  const { connectConfig } = graphState.useContainer();

  if (!connectConfig) return null;
  return (
    <>
      <Form.Item
        label="Host Name"
        field="hostname"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValue={connectConfig.hostname}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label="User Name"
        field="username"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValue={connectConfig.username}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label="Password"
        field="password"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValue={connectConfig.password}
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item
        label="Database"
        field="database"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValue={connectConfig.database}
      >
        <Input type="text" />
      </Form.Item>
    </>
  );
}

export default function ConfigDrawer({ showDrawer, onCloseDrawer }) {
  const [form] = Form.useForm();
  const { setConnectConfig } = graphState.useContainer();
  const { applicationsCtx, updateConnectionConfig } = useApplicationsCtx();

  useEffect(() => {
    if (showDrawer === "config") {
      //    viewLogs();
    }
  }, [showDrawer]);

  const save = (values) => {
    setConnectConfig(values);
  };

  return (
    <Drawer
      width={320}
      title="Config for Connection"
      visible={showDrawer === "config"}
      okText="Save"
      autoFocus={false}
      // onOk={() => form.submit()}
      // cancelText="Cancel"
      footer={null}
      mask={false}
      onCancel={() => onCloseDrawer()}
      style={{ boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)" }}
    >
      <Form
        onSubmit={save}
        form={form}
        labelAlign="left"
        requiredSymbol={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={(changedValues, allValues) => {
          updateConnectionConfig(allValues);
          //    console.log(changedValues);
          setConnectConfig(allValues);
          // console.log(allValues);
        }}
        scrollToFirstError
      >
        <ConfigBaseForm />
      </Form>
    </Drawer>
  );
}
