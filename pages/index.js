import Head from "next/head";
import Link from "next/link";
import {
  Button,
  Card,
  PageHeader,
  Space,
  Typography,
  Steps,
} from "@arco-design/web-react";

const Step = Steps.Step;

export default function Home() {
  return (
    <>
      <Head>
        <title>FastControl 2.0</title>
        <meta name="description" content="Web Application design tool" />
        <link rel="icon" href="/favicon.ico" />
        <style>{"body { overflow: auto !important; }"}</style>
      </Head>
      <div className="index-container">
        <PageHeader
          style={{
            background: "var(--color-bg-2)",
            position: "sticky",
            top: 0,
            boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.1)",
            zIndex: 2,
          }}
          title="FastControl 1.0"
          subTitle="Web Application design tool"
          extra={
            <Space>
              <Link href="/graphs">
                <Button type="primary">Database builder</Button>
              </Link>
            </Space>
          }
        />
        <div className="index-bg">
          <Typography.Title className="tc" type="secondary">
            <p>Simply easy</p>
            <p className="mark">Web Application designing & Visualizing tool</p>
          </Typography.Title>
          <Link href="/applications">
            <Button
              type="primary"
              size="large"
              className="start-button"
              style={{
                fontSize: "2em",
                height: "auto",
              }}
            >
              Get started
            </Button>
          </Link>
        </div>

        <div className="index-steps">
          <Steps
            labelPlacement="vertical"
            current={5}
            style={{
              maxWidth: "1200px",
              margin: "100px auto",
            }}
          >
            <Step title="Design data structures" description="Visually" />
            <Step title="Create relationships" description="Drag and drop" />
            <Step title="Export SQL scripts" description="It's that simple" />
          </Steps>
        </div>

        <div className="index-footer">
          <div>
            <strong>FastControl</strong> | Web Application design tool
          </div>
          <Link href="/applications">
            <Button type="text">Get started free</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
