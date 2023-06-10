import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as Infra from "../lib/infra-stack";

test("Functions created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Infra.InfraStack(app, "MyTestStack");
  // THEN

  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Lambda::Function", {
    MemorySize: 3008,
  });
  template.resourceCountIs("AWS::Lambda::Function", 1);
});
