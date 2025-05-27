output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate_validation.website.certificate_arn
}

output "certificate_domain_name" {
  description = "Domain name of the certificate"
  value       = aws_acm_certificate.website.domain_name
}

output "certificate_status" {
  description = "Status of the certificate"
  value       = aws_acm_certificate.website.status
} 