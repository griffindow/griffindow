#!/bin/bash

# Deploy script for personal website
# Usage: ./deploy.sh [bucket-name]

set -e

BUCKET_NAME=${1}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying website${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if website build exists
if [ ! -d "website/dist" ]; then
    echo -e "${RED}❌ Website build not found. Please run 'npm run build' first.${NC}"
    exit 1
fi

# Get bucket name from Terraform output if not provided
if [ -z "$BUCKET_NAME" ]; then
    echo -e "${YELLOW}📋 Getting bucket name from Terraform...${NC}"
    cd "infrastructure/terraform"
    BUCKET_NAME=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "")
    cd - > /dev/null
    
    if [ -z "$BUCKET_NAME" ]; then
        echo -e "${RED}❌ Could not get bucket name. Please provide it as argument.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}📦 Uploading files to S3 bucket: ${BUCKET_NAME}${NC}"

# Sync files to S3
aws s3 sync website/dist/ "s3://${BUCKET_NAME}" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "*.xml" \
    --exclude "*.txt"

# Upload HTML files with shorter cache
aws s3 sync website/dist/ "s3://${BUCKET_NAME}" \
    --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "*.xml" \
    --include "*.txt"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get CloudFront distribution ID and invalidate cache
echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
cd "infrastructure/terraform"
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null || echo "")
cd - > /dev/null

if [ -n "$DISTRIBUTION_ID" ]; then
    aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" > /dev/null
    echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"
else
    echo -e "${YELLOW}⚠️  Could not get CloudFront distribution ID. Cache not invalidated.${NC}"
fi

echo -e "${GREEN}🎉 Website deployed successfully!${NC}" 