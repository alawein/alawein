import { defineInfrastructure } from '@nexus/infra';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

// Define the infrastructure with all resources
const infrastructure = defineInfrastructure({
  auth,
  data,
  storage,
});

// Create additional stacks for custom resources
const billingStack = infrastructure.createStack('BillingStack');
const notificationsStack = infrastructure.createStack('NotificationsStack');
const analyticsStack = infrastructure.createStack('AnalyticsStack');

// Billing stack - Stripe webhooks and invoicing
import * as events from '@nexus/infra/events';
import * as targets from '@nexus/infra/targets';
import * as lambda from '@nexus/infra/lambda';
import * as iam from '@nexus/infra/iam';

// Stripe webhook handler
const stripeWebhookHandler = new lambda.Function(billingStack, 'StripeWebhookHandler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'stripeWebhook.handler',
  code: lambda.Code.fromAsset('nexus/functions/billing/stripeWebhook'),
  environment: {
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    DATA_TABLE_NAME: data.resources.tables['Schema'].tableName,
  },
  timeout: cdk.Duration.seconds(30),
});

// Grant permissions to write to NexusData
data.resources.tables['Schema'].grantReadWriteData(stripeWebhookHandler);

// NexusGateway for webhook endpoint
import * as apigateway from '@nexus/infra/gateway';
const webhookApi = new apigateway.RestApi(billingStack, 'WebhookApi', {
  restApiName: 'Nexus Webhooks',
  deployOptions: {
    stageName: 'prod',
  },
});

const webhook = webhookApi.root.addResource('webhook');
webhook.addResource('stripe').addMethod('POST', new apigateway.LambdaIntegration(stripeWebhookHandler));

// Notifications stack - Email and push notifications
const emailHandler = new lambda.Function(notificationsStack, 'EmailHandler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'email.handler',
  code: lambda.Code.fromAsset('nexus/functions/notifications/email'),
  environment: {
    SES_REGION: process.env.NEXUS_REGION!,
    FROM_EMAIL: process.env.FROM_EMAIL!,
    REPLY_TO_EMAIL: process.env.REPLY_TO_EMAIL!,
  },
  timeout: cdk.Duration.seconds(30),
});

// Grant SES permissions
emailHandler.addToRolePolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*'],
  })
);

// Analytics stack - Usage tracking and metrics
const analyticsHandler = new lambda.Function(analyticsStack, 'AnalyticsHandler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'analytics.handler',
  code: lambda.Code.fromAsset('nexus/functions/analytics/usage'),
  environment: {
    ANALYTICS_TABLE_NAME: data.resources.tables['Schema'].tableName,
    PLAUSIBLE_DOMAIN: process.env.PLAUSIBLE_DOMAIN!,
  },
  timeout: cdk.Duration.seconds(15),
});

// EventBridge rule for daily usage aggregation
const dailyUsageRule = new events.Rule(analyticsStack, 'DailyUsageRule', {
  schedule: events.Schedule.cron({
    minute: '0',
    hour: '1',
  }),
});

dailyUsageRule.addTarget(new targets.LambdaFunction(analyticsHandler));

// Grant permissions
data.resources.tables['Schema'].grantReadWriteData(analyticsHandler);

// Add custom outputs
infrastructure.addOutput({
  stripeWebhookUrl: webhookApi.urlForPath(webhook.pathOf(webhook.resourceOfId('stripe'))),
  emailFunctionArn: emailHandler.functionArn,
  analyticsFunctionArn: analyticsHandler.functionArn,
});

// Export resources for use in functions
export {
  infrastructure,
  stripeWebhookHandler,
  emailHandler,
  analyticsHandler,
  billingStack,
  notificationsStack,
  analyticsStack,
};
