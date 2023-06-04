import { Stack, StackProps, Duration } from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class InfraStack extends Stack {
  public readonly api: apigw.RestApi;
  public readonly apiLambda: lambda.Function;

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
  }
}
