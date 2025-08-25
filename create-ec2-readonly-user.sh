#!/usr/bin/env bash
set -euo pipefail
# This script creates an IAM user with EC2 read-only permissions and access keys.

# ===== CONFIG =====
AWS_PROFILE="${AWS_PROFILE:-admin}"        
USER_NAME="${1:-tracer-readonly}"          # 1st arg = username (default: tracer-readonly)
# ==================

echo "Creating IAM user: $USER_NAME (profile: $AWS_PROFILE)"
aws iam create-user --user-name "$USER_NAME" --profile "$AWS_PROFILE"

echo "Attaching AmazonEC2ReadOnlyAccess to: $USER_NAME"
aws iam attach-user-policy \
  --user-name "$USER_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess \
  --profile "$AWS_PROFILE"

echo "Creating access key for: $USER_NAME (save these securely)"
aws iam create-access-key --user-name "$USER_NAME" --profile "$AWS_PROFILE"

# Create profile for tracer-readonly to not mess with admin profile
aws configure --profile tracer-readonly


# steps to run

# chmod +x create-ec2-readonly-user.sh

# Use default username (tracer-readonly) and default profile (admin)
# ./create-ec2-readonly-user.sh

# Or pass a custom username
# ./create-ec2-readonly-user.sh my-readonly-user


# To get ec2 instances
# aws ec2 describe-instances --profile tracer-readonly --region eu-central-1                     

#To get EC2 instances type
# aws ec2 describe-instance-types --profile tracer-readonly --region eu-central-1 --max-results 5




