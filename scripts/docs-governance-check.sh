#!/bin/bash

# Documentation Governance Compliance Check Script
# This script validates documentation governance compliance across the monorepo

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="docs"
GOVERNANCE_DIR="$DOCS_DIR/governance"
TEMPLATE_FILE="$GOVERNANCE_DIR/DOCUMENT-TEMPLATE.md"

# Statistics
total_docs=0
compliant_docs=0
non_compliant_docs=0
missing_headers=()
broken_links=()
outdated_reviews=()

echo -e "${BLUE}🔍 Documentation Governance Compliance Check${NC}"
echo "=================================================="
echo

# Function to check if document has governance header
check_governance_header() {
    local file="$1"
    local filename=$(basename "$file")

    # Skip certain files that don't need headers
    if [[ "$filename" == "README.md" ]] || [[ "$filename" == "index.md" ]] || [[ "$filename" == "mkdocs.yml" ]]; then
        return 0
    fi

    # Check for document_metadata section
    if ! head -20 "$file" | grep -q "^---$" && head -40 "$file" | grep -q "document_metadata:"; then
        echo -e "${RED}❌ Missing governance header: $file${NC}"
        missing_headers+=("$file")
        return 1
    fi

    echo -e "${GREEN}✅ Has governance header: $file${NC}"
    return 0
}

# Function to check for broken links in markdown files
check_broken_links() {
    local file="$1"

    # Extract all markdown links
    local links=$(grep -o '\[.*\](\([^)]*\))' "$file" | sed 's/.*(\([^)]*\))/\1/' | grep -v '^http' | grep -v '^#' | grep -v '^\.\./\.\./')

    for link in $links; do
        # Remove anchor links
        local clean_link=$(echo "$link" | sed 's/#.*$//')

        if [[ -n "$clean_link" ]] && [[ "$clean_link" != "." ]] && [[ "$clean_link" != ".." ]]; then
            # Convert relative links to absolute paths
            local link_path="$clean_link"
            if [[ "$link_path" != /* ]]; then
                local file_dir=$(dirname "$file")
                link_path="$file_dir/$clean_link"
            fi

            # Normalize path
            link_path=$(realpath -m "$link_path" 2>/dev/null || echo "$link_path")

            if [[ ! -f "$link_path" ]] && [[ ! -d "$link_path" ]]; then
                echo -e "${YELLOW}⚠️  Broken link in $file: $clean_link${NC}"
                broken_links+=("$file:$clean_link")
            fi
        fi
    done
}

# Function to check review dates
check_review_dates() {
    local file="$1"

    # Look for next_review date in governance header
    local review_date=$(grep -A 20 "^---$" "$file" | grep "next_review:" | head -1 | sed 's/.*next_review: *//' | tr -d '"' || echo "")

    if [[ -n "$review_date" ]]; then
        # Convert date to timestamp for comparison
        local review_timestamp=$(date -d "$review_date" +%s 2>/dev/null || echo "0")
        local current_timestamp=$(date +%s)

        if [[ "$review_timestamp" -lt "$current_timestamp" ]]; then
            echo -e "${YELLOW}⚠️  Review overdue: $file (next review: $review_date)${NC}"
            outdated_reviews+=("$file:$review_date")
        fi
    fi
}

# Main execution
echo "📊 Scanning documentation for governance compliance..."
echo

# Find all markdown files in docs directory
while IFS= read -r -d '' file; do
    ((total_docs++))

    echo "🔍 Checking: $file"

    # Check governance header
    if check_governance_header "$file"; then
        ((compliant_docs++))
    else
        ((non_compliant_docs++))
    fi

    # Check for broken links
    check_broken_links "$file"

    # Check review dates
    check_review_dates "$file"

    echo

done < <(find "$DOCS_DIR" -name "*.md" -type f -print0)

# Summary
echo "=================================================="
echo -e "${BLUE}📈 COMPLIANCE SUMMARY${NC}"
echo "=================================================="
echo "Total documents scanned: $total_docs"
echo -e "Compliant documents: ${GREEN}$compliant_docs${NC}"
echo -e "Non-compliant documents: ${RED}$non_compliant_docs${NC}"
echo

# Issues summary
if [[ ${#missing_headers[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Documents missing governance headers:${NC}"
    for doc in "${missing_headers[@]}"; do
        echo "  - $doc"
    done
    echo
fi

if [[ ${#broken_links[@]} -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  Broken links found:${NC}"
    for link in "${broken_links[@]}"; do
        echo "  - $link"
    done
    echo
fi

if [[ ${#outdated_reviews[@]} -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  Documents with overdue reviews:${NC}"
    for review in "${outdated_reviews[@]}"; do
        echo "  - $review"
    done
    echo
fi

# Compliance percentage
if [[ $total_docs -gt 0 ]]; then
    compliance_percentage=$((compliant_docs * 100 / total_docs))
    echo -e "Compliance rate: ${BLUE}$compliance_percentage%${NC}"

    if [[ $compliance_percentage -ge 90 ]]; then
        echo -e "${GREEN}🎉 Excellent compliance!${NC}"
    elif [[ $compliance_percentage -ge 75 ]]; then
        echo -e "${YELLOW}👍 Good compliance, some improvements needed.${NC}"
    else
        echo -e "${RED}⚠️  Compliance needs attention.${NC}"
    fi
fi

echo
echo "=================================================="
echo -e "${BLUE}🔗 Next Steps${NC}"
echo "=================================================="
echo "1. Add governance headers to non-compliant documents"
echo "2. Fix broken links in documentation"
echo "3. Schedule reviews for overdue documents"
echo "4. Run this script regularly to maintain compliance"
echo
echo "For help with governance headers, see: $TEMPLATE_FILE"
echo
echo -e "${GREEN}Script completed successfully!${NC}"
