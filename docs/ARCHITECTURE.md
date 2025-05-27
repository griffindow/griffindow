# Architecture Documentation

This document describes the architecture and design decisions for the personal website infrastructure.

## Overview

The personal website is built as a static site using Astro and deployed to AWS using a modern, scalable architecture that provides:

- **High Performance**: Global CDN with edge caching
- **High Availability**: Multi-region redundancy
- **Security**: HTTPS everywhere, secure S3 access
- **Cost Efficiency**: Pay-as-you-go pricing model
- **Scalability**: Handles traffic spikes automatically

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Developer     │    │   GitHub Actions │    │   AWS Services  │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Astro Site  │ │───▶│ │ Build & Test │ │───▶│ │ S3 Bucket   │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ ┌─────────────┐ │    │ │ Terraform    │ │───▶│ │ CloudFront  │ │
│ │ Terraform   │ │───▶│ │ Deploy       │ │    │ └─────────────┘ │
│ └─────────────┘ │    │ └──────────────┘ │    │ ┌─────────────┐ │
└─────────────────┘    └──────────────────┘    │ │ Route53     │ │
                                               │ └─────────────┘ │
                                               │ ┌─────────────┐ │
                                               │ │ ACM (SSL)   │ │
                                               │ └─────────────┘ │
                                               └─────────────────┘
```

## AWS Services

### Amazon S3 (Simple Storage Service)

**Purpose**: Static website hosting and storage

**Configuration**:
- Private bucket with public access blocked
- Versioning enabled for rollback capability
- Server-side encryption (AES256)
- Website configuration for SPA routing

**Security**:
- Bucket policy allows only CloudFront access
- No direct public access to S3
- Origin Access Control (OAC) for secure access

### Amazon CloudFront

**Purpose**: Global Content Delivery Network (CDN)

**Features**:
- Global edge locations for low latency
- HTTPS enforcement and HTTP to HTTPS redirect
- Custom error pages (404 handling)
- Cache optimization for different file types
- Origin Access Control for S3 security

**Cache Behavior**:
- Static assets (CSS, JS, images): Long-term caching (1 year)
- HTML files: Short-term caching (immediate revalidation)
- Automatic compression (gzip/brotli)

### Amazon Route53

**Purpose**: DNS management and domain routing

**Configuration**:
- A records for root domain and www subdomain
- AAAA records for IPv6 support
- Alias records pointing to CloudFront distribution
- Health checks and failover (optional)

### AWS Certificate Manager (ACM)

**Purpose**: SSL/TLS certificate management

**Features**:
- Free SSL certificates for AWS services
- Automatic renewal
- DNS validation through Route53
- Wildcard certificate support

## Infrastructure as Code

### Terraform Structure

```
infrastructure/terraform/
├── main.tf              # Main configuration
├── variables.tf         # Input variables
├── outputs.tf           # Output values
├── versions.tf          # Provider versions
├── modules/             # Reusable modules
│   ├── s3-website/     # S3 bucket configuration
│   ├── cloudfront/     # CloudFront distribution
│   ├── route53/        # DNS records
│   └── ssl/            # SSL certificate
└── environments/       # Environment-specific configs
    ├── dev/            # Development environment
    └── prod/           # Production environment
```

### Module Design

Each Terraform module is designed to be:
- **Reusable**: Can be used across environments
- **Configurable**: Accepts parameters for customization
- **Self-contained**: Manages related resources together
- **Testable**: Can be validated independently

## Security Architecture

### Network Security

- **HTTPS Only**: All traffic encrypted in transit
- **Origin Access Control**: S3 bucket not publicly accessible
- **Security Headers**: Implemented via CloudFront
- **DDoS Protection**: Built-in CloudFront protection

### Access Control

- **IAM Roles**: Least privilege access for services
- **Bucket Policies**: Restrict S3 access to CloudFront only
- **API Keys**: Secure storage in GitHub Secrets
- **State Management**: Encrypted Terraform state

### Data Protection

- **Encryption at Rest**: S3 server-side encryption
- **Encryption in Transit**: HTTPS/TLS everywhere
- **Backup Strategy**: S3 versioning for rollback
- **Access Logging**: CloudFront access logs (optional)

## Performance Optimization

### Caching Strategy

1. **CloudFront Edge Caching**:
   - Static assets: 1 year TTL
   - HTML files: Immediate revalidation
   - API responses: Custom TTL based on content

2. **Browser Caching**:
   - Cache-Control headers optimized per file type
   - ETags for efficient revalidation
   - Compression enabled for all text content

### Content Optimization

- **Image Optimization**: Astro's built-in image optimization
- **Code Splitting**: Automatic with Astro
- **Minification**: CSS and JS minification
- **Tree Shaking**: Unused code elimination

## Deployment Pipeline

### CI/CD Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Code Push   │───▶│ Build Site  │───▶│ Deploy Infra│───▶│ Upload Site │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │ Run Tests   │    │ Terraform   │    │ Invalidate  │
                   │ Lint Code   │    │ Plan/Apply  │    │ CDN Cache   │
                   └─────────────┘    └─────────────┘    └─────────────┘
```

### Environment Strategy

- **Development**: Automatic deployment on `develop` branch
- **Production**: Automatic deployment on `main` branch
- **Feature Branches**: Manual deployment option
- **Rollback**: Git-based rollback with redeployment

## Monitoring and Observability

### Available Metrics

- **CloudFront**: Request count, cache hit ratio, error rates
- **S3**: Storage usage, request metrics
- **Route53**: DNS query metrics
- **ACM**: Certificate expiration monitoring

### Logging

- **CloudFront Access Logs**: Detailed request logging (optional)
- **S3 Access Logs**: Bucket access logging
- **CloudTrail**: API call logging for security
- **GitHub Actions**: Build and deployment logs

## Cost Optimization

### Cost Factors

1. **S3 Storage**: Pay for storage used (~$0.023/GB/month)
2. **CloudFront**: Pay for data transfer and requests
3. **Route53**: Pay for hosted zone and queries
4. **ACM**: Free for AWS services

### Optimization Strategies

- **CloudFront Price Classes**: Use regional for dev, global for prod
- **S3 Storage Classes**: Use Standard for active content
- **Cache Optimization**: Reduce origin requests
- **Compression**: Reduce bandwidth costs

## Disaster Recovery

### Backup Strategy

- **S3 Versioning**: Multiple versions of website content
- **Cross-Region Replication**: Optional for critical sites
- **Terraform State**: Backed up in S3 with versioning
- **Git Repository**: Source code backup

### Recovery Procedures

1. **Website Rollback**: Deploy previous Git commit
2. **Infrastructure Recovery**: Restore from Terraform state
3. **DNS Failover**: Route53 health checks (optional)
4. **Certificate Recovery**: ACM automatic renewal

## Scalability Considerations

### Current Limits

- **S3**: Virtually unlimited storage
- **CloudFront**: Global edge network
- **Route53**: Handles millions of queries
- **ACM**: No certificate limits

### Scaling Strategies

- **Traffic Spikes**: CloudFront handles automatically
- **Global Expansion**: Add more CloudFront edge locations
- **Performance**: Optimize caching and compression
- **Monitoring**: Add CloudWatch alarms and dashboards

## Future Enhancements

### Potential Improvements

1. **Advanced Monitoring**: CloudWatch dashboards and alarms
2. **Performance Monitoring**: Real User Monitoring (RUM)
3. **Security Enhancements**: WAF integration
4. **Content Management**: Headless CMS integration
5. **Analytics**: Enhanced visitor tracking
6. **API Integration**: Serverless functions for dynamic content

### Migration Considerations

- **Multi-Region**: Deploy to multiple AWS regions
- **CDN Alternatives**: Consider other CDN providers
- **Static Site Generators**: Easy migration between SSGs
- **Domain Changes**: DNS migration strategies 