#!/usr/bin/env bash
# archive-profile.sh - Archive a ghost profile after branch is merged/deleted

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REGISTRY_DIR="/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx"

usage() {
    echo "Usage: $0 <branch-name>"
    echo ""
    echo "Archive ghost profile and clean up build artifacts for a merged/deleted branch"
    echo ""
    echo "Examples:"
    echo "  $0 feature/code-review      # After merging feature/code-review to main"
    echo "  $0 experimental/agents      # After deleting experimental/agents"
    exit 1
}

if [ $# -eq 0 ]; then
    usage
fi

BRANCH_NAME="$1"
PROFILE_NAME=$(echo "$BRANCH_NAME" | sed 's/\//-/g')
DIST_DIR="dist-${PROFILE_NAME}"
ARCHIVE_DIR="${REGISTRY_DIR}/.archived"

echo -e "${BLUE}🌶️  Archiving profile for branch: ${GREEN}${BRANCH_NAME}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create archive directory
mkdir -p "$ARCHIVE_DIR/profiles"
mkdir -p "$ARCHIVE_DIR/builds"

# Check if profile exists
if ! ocx ghost profile list 2>&1 | grep -q "^${PROFILE_NAME}$"; then
    echo -e "${YELLOW}⚠️  Profile '${PROFILE_NAME}' not found (may already be archived)${NC}"
else
    echo -e "${YELLOW}[1/3]${NC} Exporting profile configuration..."
    
    # Export profile config
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    PROFILE_BACKUP="${ARCHIVE_DIR}/profiles/${PROFILE_NAME}-${TIMESTAMP}.json"
    
    ocx ghost profile show "$PROFILE_NAME" --json > "$PROFILE_BACKUP" 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Could not export profile config${NC}"
    }
    
    echo -e "${YELLOW}[2/3]${NC} Removing ghost profile..."
    ocx ghost profile remove "$PROFILE_NAME" || {
        echo -e "${RED}❌ Failed to remove profile${NC}"
        exit 1
    }
fi

# Archive build directory
if [ -d "${REGISTRY_DIR}/${DIST_DIR}" ]; then
    echo -e "${YELLOW}[3/3]${NC} Archiving build directory..."
    mv "${REGISTRY_DIR}/${DIST_DIR}" "${ARCHIVE_DIR}/builds/${DIST_DIR}-${TIMESTAMP}"
else
    echo -e "${YELLOW}[3/3]${NC} No build directory found (${DIST_DIR})"
fi

echo -e "\n${GREEN}✅ Archive complete!${NC}"
echo -e "\nArchived to:"
echo -e "  Profile: ${BLUE}${PROFILE_BACKUP}${NC}"
echo -e "  Build:   ${BLUE}${ARCHIVE_DIR}/builds/${DIST_DIR}-${TIMESTAMP}${NC}"
