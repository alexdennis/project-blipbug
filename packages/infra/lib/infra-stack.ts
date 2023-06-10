import { Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";

export class InfraStack extends Stack {
  public readonly api: apigw.RestApi;
  public readonly apiLambda: lambda.Function;
  public readonly websiteBucket: s3.Bucket;
  public readonly websiteBucketDeployment: s3deploy.BucketDeployment;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.apiLambda = new lambda.Function(this, "api-backend", {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 3008,
      timeout: Duration.seconds(10),
      handler: "dist/index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "..", "api")),
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
  }
}
