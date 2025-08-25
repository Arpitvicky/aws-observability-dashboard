This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Description

This repository shows the dashboard from simulated EC2 instances data (metrics, cost, price), designed specifically for bioinformaticians and technical users who work with scientific workflows that rely on EC2 infrastructure.

/create-ec2-readonly-user.sh -- This file has the script to create an IAM user from admin AWS profile and
provide read-only permission to AmazonEC2ReadOnlyAccess and also creating access and secret key.
It also has some commands from where we can get real time data from AWS

# In the real scenario (production), will get all metrics from

# Inventory → EC2

# CPU → CloudWatch

# RAM/GPU → CloudWatch Agent (+ NVIDIA/DCGM)

# Uptime → LaunchTime (rough) or CE/CUR (accurate hours)

# Cost → Pricing (list) or Cost Explorer/CUR (actual)


# Vercel deployment link
 

<!-- To get the real data via AWS SDK 

pnpm add @aws-sdk/client-ec2 @aws-sdk/client-cloudwatch @aws-sdk/client-cost-explorer

API design can be below to get inventory, metrics, cost and pricing

"@aws-sdk/client-ec2"
// app/api/instances/route.ts - inventory for the table
{ id, name, region, instanceType, owner, jobId, launchTime }

"@aws-sdk/client-cloudwatch"
// app/api/metrics/route.ts — CPU (CloudWatch).
RAM/GPU require CloudWatch Agent on the instance; here we just return CPU average for a range.
Memory/GPU: once CW Agent is installed, query Namespace: "CWAgent" and metric names you publish (e.g., mem_used_percent, gpu_utilization) with similar code and merge lines on the same timestamps.

@aws-sdk/client-cost-explorer"
/app/api/costs/route.ts — daily spend + grouping (Cost Explorer)

"@aws-sdk/client-cost-explorer"
/app/api/kpis/route.ts
