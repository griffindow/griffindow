output "website_url" {
  description = "URL of the website"
  value       = "https://${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = module.s3_website.bucket_id
}

output "s3_bucket_domain_name" {
  description = "S3 bucket domain name"
  value       = module.s3_website.bucket_domain_name
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = module.ssl.certificate_arn
}

output "route53_zone_id" {
  description = "Route53 hosted zone ID"
  value       = module.route53.zone_id
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}
