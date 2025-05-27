variable "domain_name" {
  description = "Domain name for the website"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

# cloudfront_distribution_arn variable removed - bucket policy now handled in main.tf 
