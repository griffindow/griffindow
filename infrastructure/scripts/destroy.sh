#!/bin/bash

# Destroy script for personal website infrastructure
# Usage: ./destroy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}⚠️  WARNING: This will destroy all infrastructure${NC}"
echo -e "${YELLOW}This action cannot be undone!${NC}"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${GREEN}Operation cancelled${NC}"
    exit 0
fi

echo -e "${RED}🗑️  Destroying infrastructure...${NC}"

# Check if Terraform directory exists
if [ ! -d "infrastructure/terraform" ]; then
    echo -e "${RED}❌ Terraform directory not found: infrastructure/terraform${NC}"
    exit 1
fi

cd "infrastructure/terraform"

# Check if Terraform is initialized
if [ ! -d ".terraform" ]; then
    echo -e "${YELLOW}📋 Initializing Terraform...${NC}"
    terraform init
fi

# Empty S3 bucket first (required before destruction)
echo -e "${YELLOW}🗑️  Emptying S3 bucket...${NC}"
BUCKET_NAME=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "")

if [ -n "$BUCKET_NAME" ]; then
    echo -e "${YELLOW}Emptying bucket: ${BUCKET_NAME}${NC}"
    aws s3 rm "s3://${BUCKET_NAME}" --recursive || true
else
    echo -e "${YELLOW}⚠️  Could not get bucket name from Terraform outputs${NC}"
fi

# Run terraform destroy
echo -e "${RED}💥 Running terraform destroy...${NC}"
terraform destroy -auto-approve

echo -e "${GREEN}✅ Infrastructure destroyed successfully${NC}"
echo -e "${YELLOW}Note: You may need to manually delete the Route53 hosted zone if it was created outside of this project${NC}"

cd - > /dev/null 