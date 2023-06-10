import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  CfnOutput,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

export class InfraStack extends Stack {
  public readonly api: apigw.RestApi;
  public readonly apiLambda: lambda.Function;
  public readonly websiteBucket: s3.Bucket;
  public readonly websiteBucketDeployment: s3deploy.BucketDeployment;
  public readonly websiteBucketNameOutput: CfnOutput;
  public readonly datbaseTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.datbaseTable = new dynamodb.Table(this, "blipbug-database", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.apiLambda = new lambda.Function(this, "api-backend", {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 3008,
      timeout: Duration.seconds(10),
      handler: "dist/index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "..", "api")),
      environment: {
        DATABASE_TABLE_NAME: this.datbaseTable.tableName,
      },
    });

    this.api = new apigw.LambdaRestApi(this, "blipbug-api", {
      handler: this.apiLambda,
      proxy: true,
    });

    this.websiteBucket = new s3.Bucket(this, "ui", {
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        ignorePublicAcls: false,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });

    this.websiteBucketDeployment = new s3deploy.BucketDeployment(
      this,
      "ui-deployment",
      {
        sources: [
          s3deploy.Source.asset(
            path.join(__dirname, "..", "..", "ui", "build")
          ),
        ],
        destinationBucket: this.websiteBucket,
      }
    );

    this.websiteBucketNameOutput = new CfnOutput(this, "websiteBucketName", {
      value: this.websiteBucket.bucketName,
    });
  }
}
