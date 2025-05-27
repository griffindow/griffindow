# Personal Website

A modern personal website built with Astro and deployed to AWS using Terraform.

## Project Structure

```
dotcom/
├── README.md                   # This file
├── .gitignore                  # Git ignore patterns
│
├── website/                    # Astro frontend application
│   ├── src/
│   ├── public/
│   ├── astro.config.mjs
│   └── package.json
│
├── infrastructure/             # AWS infrastructure as code
│   ├── terraform/
│   │   ├── main.tf             # Main Terraform configuration
│   │   ├── variables.tf        # Input variables
│   │   ├── outputs.tf          # Output values
│   │   ├── versions.tf         # Provider versions
│   │   ├── terraform.tfvars    # Configuration values
│   │   ├── backend.tf          # Remote state configuration
│   │   └── modules/
│   │       ├── s3-website/     # S3 static website module
│   │       ├── cloudfront/     # CloudFront CDN module
│   │       ├── route53/        # DNS management module
│   │       └── ssl/            # SSL certificate module
│   └── scripts/
│       ├── deploy.sh           # Deployment script
│       └── destroy.sh          # Infrastructure teardown
│
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml          # Automatic deployment
│
└── docs/                       # Documentation
    |   ARCHITECTURE.md         # System architecture
    └── PROJECT.md              # Project documentation
```

## Technology Stack

- **Frontend**: Astro (Static Site Generator)
- **Infrastructure**: AWS (S3, CloudFront, Route53, ACM)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions
- **Domain**: Custom domain with SSL

## AWS Services Used

- **S3**: Static website hosting
- **CloudFront**: Global CDN for fast content delivery
- **Route53**: DNS management
- **ACM**: SSL/TLS certificates
- **IAM**: Access management for deployment

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
