#!/usr/bin/env bash
# test-branch.sh - Switch to a branch, build registry, and launch OpenCode for testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGISTRY_DIR="/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx"

# Usage
usage() {
    echo "Usage: $0 <branch-name>"
    echo ""
    echo "Examples:"
    echo "  $0 main                      # Test main branch"
    echo "  $0 feature/code-review       # Test feature branch"
    echo "  $0 experimental/agents       # Test experimental branch"
    echo ""
    echo "What this script does:"
    echo "  1. Switches to the specified branch"
    echo "  2. Builds registry to dist-<branch-name>/"
    echo "  3. Creates/activates ghost profile named after branch"
    echo "  4. Configures local registry in ghost profile"
    echo "  5. Launches OpenCode with the ghost profile"
    exit 1
}

# Check arguments
if [ $# -eq 0 ]; then
    usage
fi

BRANCH_NAME="$1"

# Sanitize branch name for profile (replace / with -)
PROFILE_NAME=$(echo "$BRANCH_NAME" | sed 's/\//-/g')
DIST_DIR="dist-${PROFILE_NAME}"

echo -e "${BLUE}🌶️  Chili OCX Registry - Branch Testing${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Step 1: Switch to branch
echo -e "\n${YELLOW}[1/5]${NC} Switching to branch: ${GREEN}${BRANCH_NAME}${NC}"
cd "$REGISTRY_DIR"
git checkout "$BRANCH_NAME" || {
    echo -e "${RED}❌ Failed to checkout branch: ${BRANCH_NAME}${NC}"
    exit 1
}

# Step 2: Build to branch-specific dist
echo -e "\n${YELLOW}[2/5]${NC} Building registry to: ${GREEN}${DIST_DIR}${NC}"
bunx ocx build . --out "$DIST_DIR" || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}

# Step 3: Initialize ghost mode if needed
echo -e "\n${YELLOW}[3/5]${NC} Setting up ghost profile: ${GREEN}${PROFILE_NAME}${NC}"
if ! ocx ghost profile list 2>&1 | grep -q "No profiles found"; then
    echo "Ghost mode already initialized"
else
    echo "Initializing ghost mode..."
    ocx ghost init
fi

# Step 4: Create/use profile
if ocx ghost profile list 2>&1 | grep -q "^${PROFILE_NAME}$"; then
    echo "Using existing profile: ${PROFILE_NAME}"
    ocx ghost profile use "$PROFILE_NAME"
else
    echo "Creating new profile: ${PROFILE_NAME}"
    ocx ghost profile add "$PROFILE_NAME"
fi

# Step 5: Configure local registry
echo -e "\n${YELLOW}[4/5]${NC} Configuring local registry in ghost profile"
REGISTRY_URL="file://${REGISTRY_DIR}/${DIST_DIR}"
echo "Registry URL: ${REGISTRY_URL}"

# Remove existing local registry if present
ocx ghost registry remove chili-local 2>/dev/null || true

# Add local registry
ocx ghost registry add chili-local "$REGISTRY_URL"

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}[5/5]${NC} Launching OpenCode with profile: ${GREEN}${PROFILE_NAME}${NC}"
echo -e "\nYou can now test components from branch: ${GREEN}${BRANCH_NAME}${NC}"
echo -e "Install components with: ${BLUE}ocx ghost add chili-ocx/component-name${NC}"
echo -e "\n${BLUE}Press Ctrl+C to exit OpenCode when done testing${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Launch OpenCode
ocx ghost opencode --profile "$PROFILE_NAME"
