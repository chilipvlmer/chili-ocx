#!/usr/bin/env bash
# clean-builds.sh - Clean up old branch-specific build directories

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REGISTRY_DIR="/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx"

echo -e "${BLUE}🌶️  Cleaning up branch builds${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Get current branch
CURRENT_BRANCH=$(cd "$REGISTRY_DIR" && git branch --show-current)
CURRENT_PROFILE=$(echo "$CURRENT_BRANCH" | sed 's/\//-/g')

echo -e "Current branch: ${GREEN}${CURRENT_BRANCH}${NC}"
echo -e "Protected build: ${GREEN}dist-${CURRENT_PROFILE}${NC}\n"

# Find all dist-* directories
if ! compgen -G "${REGISTRY_DIR}/dist-*" > /dev/null; then
    echo -e "${YELLOW}No branch builds found${NC}"
    exit 0
fi

echo -e "${YELLOW}Found branch builds:${NC}"
TOTAL_SIZE=0
for dist in "${REGISTRY_DIR}"/dist-*; do
    branch=$(basename "$dist" | sed 's/^dist-//')
    size=$(du -sh "$dist" 2>/dev/null | cut -f1)
    
    if [ "dist-${CURRENT_PROFILE}" == "$(basename "$dist")" ]; then
        echo -e "  - ${branch} (${size}) ${GREEN}[CURRENT]${NC}"
    else
        echo -e "  - ${branch} (${size})"
    fi
done

echo ""
read -p "Remove old builds (keep current branch)? [y/N] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    for dist in "${REGISTRY_DIR}"/dist-*; do
        if [ "dist-${CURRENT_PROFILE}" != "$(basename "$dist")" ]; then
            echo -e "Removing: ${YELLOW}$(basename "$dist")${NC}"
            rm -rf "$dist"
        fi
    done
    echo -e "\n${GREEN}✅ Cleanup complete${NC}"
else
    echo -e "\n${BLUE}Cleanup cancelled${NC}"
fi
