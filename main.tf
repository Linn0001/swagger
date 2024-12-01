provider "aws" {
  region = "us-east-1" # Cambia esto por la región que necesites
}

resource "aws_api_gateway_rest_api" "this" {
  name        = "serverless-swagger-ui"
  description = "This is a test API Gateway to demonstrate the use of Swagger UI"

  body = file("${path.module}/api-gateway-definition.yaml")

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_lambda_function" "orders_handler" {
  function_name = "orders-handler"
  
  # Referencia el rol IAM ya existente, sustituye con el ARN del rol
  role          = "arn:aws:iam::866507108567:role/LabRole"

  filename         = data.archive_file.orders_handler.output_path
  source_code_hash = data.archive_file.orders_handler.output_base64sha256
  handler          = "orders.handler"
  runtime          = "nodejs18.x"
}

data "archive_file" "orders_handler" {
  type        = "zip"
  source_file = "${path.module}/src/orders/orders.js"
  output_path = "${path.module}/src/orders/orders.zip"
}

resource "aws_iam_role_policy_attachment" "orders_handler" {
  role       = "LabRole"  # Usa el nombre del rol existente
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_permission" "orders_handler" {
  function_name = aws_lambda_function.orders_handler.function_name

  action     = "lambda:InvokeFunction"
  principal  = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.this.execution_arn}/*"
}