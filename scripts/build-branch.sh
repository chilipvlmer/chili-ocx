#!/usr/bin/env bash
# build-branch.sh - Build registry for a specific branch without launching OpenCode

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REGISTRY_DIR="/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx"

usage() {
    echo "Usage: $0 <branch-name>"
    echo ""
    echo "Build registry for a branch without launching OpenCode"
    echo ""
    echo "Examples:"
    echo "  $0 main"
    echo "  $0 feature/code-review"
    exit 1
}

if [ $# -eq 0 ]; then
    usage
fi

BRANCH_NAME="$1"
PROFILE_NAME=$(echo "$BRANCH_NAME" | sed 's/\//-/g')
DIST_DIR="dist-${PROFILE_NAME}"

echo -e "${BLUE}🌶️  Building registry for branch: ${GREEN}${BRANCH_NAME}${NC}"

cd "$REGISTRY_DIR"
git checkout "$BRANCH_NAME"
bunx ocx build . --out "$DIST_DIR"

echo -e "\n${GREEN}✅ Built to: ${DIST_DIR}${NC}"
echo -e "Registry URL: ${BLUE}file://${REGISTRY_DIR}/${DIST_DIR}${NC}"
