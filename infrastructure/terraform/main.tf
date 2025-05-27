terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "griffindow-tfstate"
    key    = "personal-website/terraform.tfstate"
    region = "us-east-1"

    # Enable state locking
    dynamodb_table = "griffindow-tfstate"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_caller_identity" "current" {}

# S3 bucket for website hosting
module "s3_website" {
  source = "./modules/s3-website"

  domain_name = var.domain_name

  tags = var.tags
}

# SSL certificate
module "ssl" {
  source = "./modules/ssl"

  domain_name = var.domain_name

  tags = var.tags
}

# CloudFront distribution
module "cloudfront" {
  source = "./modules/cloudfront"

  domain_name           = var.domain_name
  s3_bucket_domain_name = module.s3_website.bucket_domain_name
  s3_bucket_id          = module.s3_website.bucket_id
  certificate_arn       = module.ssl.certificate_arn
  price_class           = var.cloudfront_price_class

  tags = var.tags

  depends_on = [module.ssl]
}

# Route53 DNS
module "route53" {
  source = "./modules/route53"

  domain_name               = var.domain_name
  cloudfront_domain_name    = module.cloudfront.domain_name
  cloudfront_hosted_zone_id = module.cloudfront.hosted_zone_id
  certificate_arn           = module.ssl.certificate_arn

  tags = var.tags

  depends_on = [module.cloudfront]
}

# S3 bucket policy for CloudFront access (applied after CloudFront is created)
resource "aws_s3_bucket_policy" "website_cloudfront_policy" {
  bucket = module.s3_website.bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_website.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [module.cloudfront, module.s3_website]
}
