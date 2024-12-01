resource "aws_api_gateway_rest_api" "this" {
  name        = "serverless-swagger-ui"
  description = "This is a test API Gateway to demonstrate the use of Swagger UI"

  body = file("${path.module}/api-gateway-definition.yaml")

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}
